import { createRouter, createWebHashHistory } from 'vue-router'

// 1. 定义静态路由 (只包含所有用户都能访问的页面)
const routes = [
  {
    path: '/',
    redirect: '/home', // 这里的 /home 等动态路由加载完后就能访问了
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: { title: '登录' },
  },
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('@/layouts/index.vue'),
    // 关键点：这里的 children 现在是空的！
    // 等待 AuthStore + initDynamicRouter 往里面“塞”积木
    children: [],
  },
  // 404 页面通常也放在这里，或者放在动态路由的最后
  // {
  //   path: '/404',
  //   name: '404',
  //   component: () => import('@/components/ErrorMessage/404.vue'),
  //   meta: { title: '404' }
  // },
  // 解决刷新页面时匹配不到路由的问题（捕获所有未定义路由）
  // 注意：在动态路由中，这个通常建议在动态路由加载完毕后再添加，
  // 或者先指向一个 Loading 页，否则刷新时可能瞬间跳 404
  // 这里暂时先不写 path: '/:pathMatch(.*)*'，交给路由守卫处理
]

const router = createRouter({
  // 建议改回 Hash 模式 (createWebHashHistory) 开发时更少 404 问题，
  // 如果必须用 WebHistory，记得配置 Nginx
  history: createWebHashHistory(),
  routes,
})

export default router
