//import service from "@/utils/service"; // 你封装的 axios 实例

// 模拟的后端菜单数据（根据你的 views 目录结构来写）
// 假设你有 views/home/index.vue 和 views/system/user/index.vue
export const getAuthMenuListApi = () => {
  // 这里直接返回 Promise 模拟请求成功，实际项目中是 service.get(...)
  return Promise.resolve({
    data: [
      {
        path: '/home',
        name: 'Home',
        component: '/home/index', // 对应 views/home/index.vue
        meta: {
          icon: 'HomeFilled',
          title: '首页',
          isLink: '',
          isHide: false,
          isFull: false,
          isAffix: true,
          isKeepAlive: true,
        },
      },
      {
        path: '/system',
        name: 'System',
        redirect: '/system/user',
        meta: {
          icon: 'Setting',
          title: '系统管理',
          isLink: '',
          isHide: false,
          isFull: false,
          isAffix: false,
          isKeepAlive: true,
        },
        children: [
          {
            path: '/system/user',
            name: 'User',
            component: '/system/user/index', // 对应 views/system/user/index.vue
            meta: {
              icon: 'User',
              title: '用户管理',
              isLink: '',
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: true,
            },
          },
          {
            path: '/system/role',
            name: 'Role',
            component: '/system/role/index',
            meta: {
              icon: 'Avatar',
              title: '角色管理',
              isLink: '',
              isHide: false,
              isFull: false,
              isAffix: false,
              isKeepAlive: true,
            },
          },
        ],
      },
    ],
  })
}
