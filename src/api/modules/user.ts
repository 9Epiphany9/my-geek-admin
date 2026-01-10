import { service } from '@/api/index'

export interface User {
  id: string
  username: string
  gender: number
  age: number
  email: string
  status: number
  avatar: string
}

export interface GetUserListParams {
  pageNum?: number
  pageSize?: number
  username?: string
  status?: number | ''
}

export interface Paginated<T> {
  list: T[]
  total: number
}

// 查询列表（分页 + 搜索）
export const getUserList = (params: GetUserListParams) =>
  service.get<Paginated<User>>('/system/user/list', { params })

// 新增用户
export const addUser = (data: Omit<User, 'id'>) => service.post<boolean>('/system/user/add', data)

// 编辑用户
export const editUser = (data: Partial<User> & { id: string }) =>
  service.post<boolean>('/system/user/edit', data)

// 删除用户
export const deleteUser = (data: { id: string }) =>
  service.post<boolean>('/system/user/delete', data)

// 修改状态
export const changeUserStatus = (data: { id: string; status: number }) =>
  service.post<boolean>('/system/user/status', data)

// 修改密码
export const changePasswordApi = (data: { oldPassword: string; newPassword: string }) =>
  service.post<boolean>('/system/user/password', data)
