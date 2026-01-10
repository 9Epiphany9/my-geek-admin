import axios from 'axios'
import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/stores/modules/user'

/**
 * 响应数据格式（后端约定）
 * @template T 数据类型
 */
export interface ApiResponse<T = unknown> {
  code: number
  data: T
  msg?: string
}

/**
 * 请求重试配置
 */
interface RetryConfig {
  retry?: number // 重试次数
  retryDelay?: number // 重试延迟（毫秒）
}

/**
 * Token 刷新队列：解决并发请求时重复刷新 token 的问题
 */
class TokenRefreshQueue {
  private queue: Array<() => void> = []
  private isRefreshing = false

  /**
   * 等待 token 刷新完成
   */
  async wait(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isRefreshing) {
        resolve()
        return
      }
      this.queue.push(resolve)
    })
  }

  /**
   * 标记开始刷新
   */
  start() {
    this.isRefreshing = true
  }

  /**
   * 标记刷新完成，唤醒所有等待的请求
   */
  done() {
    this.isRefreshing = false
    this.queue.forEach((cb) => cb())
    this.queue = []
  }

  /**
   * 取消刷新（通常是刷新失败时调用）
   */
  cancel() {
    this.isRefreshing = false
    this.queue = []
  }
}

const refreshQueue = new TokenRefreshQueue()

/**
 * 创建 axios 实例
 */
export function createService(): AxiosInstance {
  const service = axios.create({
    baseURL: '/api',
    timeout: 10000,
  })

  /**
   * 请求拦截器：添加 Token、设置重试参数
   */
  service.interceptors.request.use(
    (config: InternalAxiosRequestConfig & RetryConfig) => {
      const userStore = useUserStore()
      if (userStore.token) {
        config.headers['x-access-token'] = userStore.token
      }
      // 设置默认重试次数
      config.retry = config.retry || 2
      config.retryDelay = config.retryDelay || 500
      return config
    },
    (error) => Promise.reject(error),
  )

  /**
   * 响应拦截器：处理成功/失败、错误分类、重试、Token 刷新
   */
  service.interceptors.response.use(
    (response: AxiosResponse<ApiResponse>) => {
      const { data } = response
      // 业务成功（code === 200）
      if (data.code === 200) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.data as any
      }
      // 业务错误
      ElMessage.error(data.msg || '请求出错')
      return Promise.reject(new Error(data.msg || '业务请求失败'))
    },
    async (error: AxiosError) => {
      const config = error.config as InternalAxiosRequestConfig & RetryConfig
      const status = error.response?.status

      // 401：Token 过期，尝试刷新
      if (status === 401) {
        // 等待队列中的其他请求完成（避免重复刷新）
        await refreshQueue.wait()

        // 如果已经开始刷新，直接等待
        if (refreshQueue['isRefreshing']) {
          return service.request(config)
        }

        // 标记开始刷新
        refreshQueue.start()

        try {
          const userStore = useUserStore()
          // 调用刷新 token 接口
          const res = await axios.post<ApiResponse<{ token: string }>>(
            '/api/auth/refresh-token',
            {},
          )
          const newToken = res.data.data.token

          // 更新 store 中的 token
          userStore.token = newToken

          // 更新当前请求的 token
          if (config.headers) {
            config.headers['x-access-token'] = newToken
          }

          // 唤醒等待的请求，重新发送当前请求
          refreshQueue.done()
          return service.request(config)
        } catch (err) {
          // Token 刷新失败，清除登录状态并跳转到登录页
          refreshQueue.cancel()
          const userStore = useUserStore()
          userStore.token = ''
          localStorage.removeItem('geeker-token')
          ElMessage.error('登录过期，请重新登录')
          // 这里可以调用 router.push('/login')
          return Promise.reject(err)
        }
      }

      // 自动重试（除了 401、403、400 等不应重试的错误）
      if (config && config.retry && ![400, 401, 403, 404, 422].includes(status!)) {
        config.retry -= 1
        if (config.retry > 0) {
          // 延迟后重试（指数退避）
          await new Promise((resolve) =>
            setTimeout(resolve, config.retryDelay! * Math.pow(2, 2 - config.retry!)),
          )
          return service.request(config)
        }
      }

      // 网络错误或其他错误
      if (!error.response) {
        ElMessage.error('网络连接失败，请检查网络')
      } else {
        ElMessage.error(error.message || '请求失败，请重试')
      }

      return Promise.reject(error)
    },
  )

  return service
}

export const service = createService()
export default service
