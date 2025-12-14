import axios from 'axios'
import { useUserStore } from '@/stores/modules/user'
import { ElMessage } from 'element-plus'
const service = axios.create({
  baseURL: 'https://mock.presstime.cn/mock/693d0b2163cf614bb405edb0/epiphany/my-geeker-admin',
  timeout: 10000,
})

// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers['x-access-token'] = userStore.token
    }
    // 在发送请求之前做些什么
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  },
)

// 添加响应拦截器
service.interceptors.response.use(
  function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    const { data } = response
    //假设后端返回成功,状态码是200,剥一层外皮返回
    if (data.code === 200) {
      return data.data
    } else {
      //处理业务错误
      ElMessage.error(data.msg || '请求出错')
      return Promise.reject(data)
    }
  },
  function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    if (error.response && error.response.status === 401) {
      ElMessage.error('登录过期，请重新登录')
      // 这里应该做 logout 逻辑
    } else {
      ElMessage.error(error.message || '网络异常')
    }
    return Promise.reject(error)
  },
)

export default service
