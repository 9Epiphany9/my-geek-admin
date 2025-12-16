import router from '@/router/index'
import { useUserStore } from '@/stores/modules/user'
import { useAuthStore } from '@/stores/modules/auth'
import { initDynamicRouter } from '@/utils/router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 路由白名单 (不需要登录就能访问的页面)
const ROUTER_WHITE_LIST = ['/login', '/404']

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  const authStore = useAuthStore()
  const token = userStore.token

  // 1.如果是访问登录页
  if (to.path === '/login') {
    if (token) return next(from.fullPath) // 有 token 不让回登录页
    return next()
  }

  // 2.如果是白名单，直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next()

  // 3.判断是否有 Token，没有重定向到 login
  if (!token) return next({ path: '/login', replace: true })

  // 4.判断是否已经加载过动态路由
  // 我们用 authMenuList 的长度来判断。如果没加载过，它是空的。
  if (authStore.authMenuList.length === 0) {
    try {
      // 申请加载路由
      await initDynamicRouter(router, authStore)
      // 加载按钮权限 (这就存到 Store 里了)
      await authStore.getAuthButtonList()
      // 关键：动态添加路由后，必须用 ...to replace: true 再跳一次
      // 否则第一次访问可能会白屏
      return next({ ...to, replace: true })
    } catch (error) {
      return next({ path: '/login', replace: true })
    }
  }

  // 5.正常访问
  next()
})

router.afterEach(() => {
  NProgress.done()
})
