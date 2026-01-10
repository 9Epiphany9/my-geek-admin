import type { MockMethod } from 'vite-plugin-mock'

const menuData = [
  {
    path: '/home',
    name: 'Home',
    component: '/home/index',
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
        component: '/system/user/index',
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
      {
        path: '/system/log',
        name: 'SystemLog',
        component: '/system/log/index',
        meta: {
          title: '系统日志',
          icon: 'Document',
        },
      },
      {
        path: '/demos/log',
        name: 'SystemLogDemo',
        component: '/demos/virtual-scroll-raw',
        meta: {
          title: '系统日志demo',
          icon: 'Document',
        },
      },
    ],
  },
]

const buttonData = ['user:add', 'user:edit', 'user:delete', 'user:export']

// 模拟的 token（实际项目中应该由后端生成）
let mockToken = 'mock-token-' + Date.now()

export default [
  {
    url: '/api/auth/login',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const { username, password } = (body || {}) as { username?: string; password?: string }
      // 简单校验
      if (!username || !password) {
        return { code: 400, msg: '用户名和密码不能为空' }
      }
      mockToken = 'mock-token-' + Date.now()
      return { code: 200, data: { token: mockToken } }
    },
  },
  {
    url: '/api/auth/refresh-token',
    method: 'post',
    response: () => {
      mockToken = 'mock-token-' + Date.now()
      return { code: 200, data: { token: mockToken } }
    },
  },
  {
    url: '/api/auth/menu',
    method: 'get',
    response: () => {
      return { code: 200, data: menuData }
    },
  },
  {
    url: '/api/auth/buttons',
    method: 'get',
    response: () => {
      return { code: 200, data: buttonData }
    },
  },
] as MockMethod[]
