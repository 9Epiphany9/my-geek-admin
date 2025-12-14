import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/layout',
    name: 'Layout',
    component: () => import('@/layouts/index.vue'),
    // 这里开始调整结构
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: { title: '首页', icon: 'HomeFilled' },
      },
      // --- 修改重点开始 ---
      {
        path: '/system',
        name: 'System',
        // 关键点1：父级路由需要有 title，面包屑才能显示
        meta: { title: '系统管理', icon: 'Setting' },
        // 关键点2：方便用户点击面包屑的"系统管理"时跳转
        redirect: '/system/user',
        children: [
          {
            // 子路由 path 建议写相对路径（不带 /），这就变成了 /system/user
            path: 'user',
            name: 'User',
            component: () => import('@/views/system/user/index.vue'),
            meta: { title: '用户管理', icon: 'User' },
          },
          {
            path: 'role',
            name: 'Role',
            component: () => import('@/views/system/role/index.vue'), // 假设你有这个文件
            meta: { title: '角色管理', icon: 'Avatar' },
          },
        ],
      },
      // --- 修改重点结束 ---
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
