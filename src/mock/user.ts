import type { MockMethod } from 'vite-plugin-mock'

// 内存数据库（仅在开发期间存在）
interface User {
  id: string
  username: string
  gender: number
  age: number
  email: string
  status: number
  avatar: string
}

let userList: User[] = [
  { id: '1', username: 'Geeker', gender: 1, age: 18, email: 'geek@163.com', status: 1, avatar: '' },
  { id: '2', username: 'Spicy', gender: 2, age: 22, email: 'spicy@qq.com', status: 0, avatar: '' },
  {
    id: '3',
    username: 'Admin',
    gender: 1,
    age: 30,
    email: 'admin@qq.com',
    status: 1,
    avatar: '/01_1.jpg',
  },
  { id: '4', username: 'User001', gender: 2, age: 25, email: 'u001@qq.com', status: 0, avatar: '' },
]

const generateId = () => Math.floor(Math.random() * 100000).toString()

export default [
  // 列表查询（分页 + 搜索）
  {
    url: '/api/system/user/list',
    method: 'get',
    response: ({ query }: { query: Record<string, unknown> }) => {
      // 1. 搜索过滤
      let result = userList
      const {
        username = '',
        status = '',
        pageNum = '1',
        pageSize = '10',
      } = (query || {}) as Record<string, string>
      if (username)
        result = result.filter((i) =>
          i.username.toLowerCase().includes(String(username).toLowerCase()),
        )
      if (status !== '' && status !== undefined)
        result = result.filter((i) => i.status === Number(status))

      // 2. 分页
      const _pageNum = Number(pageNum) || 1
      const _pageSize = Number(pageSize) || 10
      const total = result.length
      const list = result.slice((_pageNum - 1) * _pageSize, _pageNum * _pageSize)

      return { code: 200, data: { list, total } }
    },
  },
  // 新增
  {
    url: '/api/system/user/add',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const b = body || {}
      const rb = b as Record<string, unknown>
      const newUser: User = {
        id: generateId(),
        username: typeof rb.username === 'string' ? rb.username : '',
        gender: typeof rb.gender === 'number' ? rb.gender : Number(rb.gender ?? 1),
        age: typeof rb.age === 'number' ? rb.age : Number(rb.age ?? 0),
        email: typeof rb.email === 'string' ? rb.email : '',
        status: typeof rb.status === 'number' ? rb.status : Number(rb.status ?? 1),
        avatar: typeof rb.avatar === 'string' ? rb.avatar : '',
      }
      userList.unshift(newUser)
      return { code: 200, data: true, msg: '新增成功' }
    },
  },
  // 编辑
  {
    url: '/api/system/user/edit',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const index = userList.findIndex((i) => i.id === String((body || {}).id))
      if (index >= 0) {
        const updated = { ...userList[index], ...(body || {}) } as User
        userList[index] = updated
      }
      return { code: 200, data: true, msg: '编辑成功' }
    },
  },
  // 删除
  {
    url: '/api/system/user/delete',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const { id } = (body || {}) as { id?: string }
      userList = userList.filter((i) => i.id !== String(id))
      return { code: 200, data: true, msg: '删除成功' }
    },
  },
  // 修改状态
  {
    url: '/api/system/user/status',
    method: 'post',
    response: ({ body }: { body: Record<string, unknown> }) => {
      const { id, status } = (body || {}) as { id?: string; status?: number | string }
      const idx = userList.findIndex((i) => i.id === String(id))
      if (idx >= 0) userList[idx]!.status = Number(status)
      return { code: 200, data: true, msg: '状态修改成功' }
    },
  },
  // 修改密码
  {
    url: '/api/system/user/password',
    method: 'post',
    response: () => {
      return { code: 200, data: true, msg: '密码修改成功' }
    },
  },
] as MockMethod[]
