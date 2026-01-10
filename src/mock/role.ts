import type { MockMethod } from 'vite-plugin-mock'

let roleList = [
  { id: '1', roleName: '超级管理员', status: 1, remark: '拥有最高权限' },
  { id: '2', roleName: '普通用户', status: 1, remark: '只能查看，不能修改' },
  { id: '3', roleName: '游客', status: 0, remark: '只能看首页' },
]

type RoleListQuery = {
  roleName?: string
  status?: string | number
  pageNum?: string | number
  pageSize?: string | number
}

const menuTree = [
  { id: '1', title: '首页', children: [] },
  {
    id: '2',
    title: '系统管理',
    children: [
      { id: '2-1', title: '用户管理' },
      { id: '2-2', title: '角色管理' },
      { id: '2-3', title: '菜单管理' },
    ],
  },
  { id: '3', title: '数据大屏', children: [] },
]

// 角色 -> 已拥有菜单的映射
const roleMenus: Record<string, string[]> = {
  '2': ['1', '2-1'],
}

export default [
  // 角色列表
  {
    url: '/api/system/role/list',
    method: 'get',
    response: ({ query }: { query?: RoleListQuery }) => {
      const { roleName = '', status = '', pageNum = 1, pageSize = 10 } = query || {}

      const filtered = roleList.filter((role) => {
        const matchName = roleName ? role.roleName.includes(String(roleName)) : true
        const matchStatus =
          status === '' || status === undefined ? true : role.status === Number(status)
        return matchName && matchStatus
      })

      const page = Number(pageNum) || 1
      const size = Number(pageSize) || filtered.length
      const start = (page - 1) * size
      const end = start + size
      const list = filtered.slice(start, end)

      return { code: 200, data: { list, total: filtered.length } }
    },
  },
  // 菜单树
  {
    url: '/api/system/menu/list',
    method: 'get',
    response: () => {
      return { code: 200, data: menuTree }
    },
  },
  // 获取角色已有菜单
  {
    url: '/api/system/role/menu',
    method: 'get',
    response: ({ query }: { query: Record<string, unknown> }) => {
      const { roleId = '' } = (query || {}) as { roleId?: string }
      return { code: 200, data: roleMenus[String(roleId)] || [] }
    },
  },
  // 保存角色菜单
  {
    url: '/api/system/role/menu/save',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const { roleId, menuIds } = (body || {}) as { roleId?: string; menuIds?: unknown }
      roleMenus[String(roleId)] = Array.isArray(menuIds) ? (menuIds as string[]) : []
      return { code: 200, data: true, msg: '保存成功' }
    },
  },
  // 切换角色状态
  {
    url: '/api/system/role/status',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const { id, status } = (body || {}) as { id?: string; status?: number }
      roleList = roleList.map((role) =>
        role.id === String(id) ? { ...role, status: Number(status) === 1 ? 1 : 0 } : role,
      )
      return { code: 200, data: true, msg: '更新成功' }
    },
  },
] as MockMethod[]
