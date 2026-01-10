import { service } from '@/api/index'

export interface RoleItem {
  id: string
  roleName: string
  status: number
  remark?: string
}

export interface MenuTree {
  id: string
  title: string
  children?: MenuTree[]
}

export interface GetRoleListParams {
  roleName?: string
  status?: number | ''
  pageNum?: number
  pageSize?: number
}

export interface Paginated<T> {
  list: T[]
  total: number
}

export const getRoleList = (params: GetRoleListParams) =>
  service.get<Paginated<RoleItem>>('/system/role/list', { params })

export const getMenuList = () => service.get<MenuTree[]>('/system/menu/list')

export const getRoleMenu = (params: { roleId: string }) =>
  service.get<string[]>('/system/role/menu', { params })

export const saveRoleMenu = (data: { roleId: string; menuIds: string[] }) =>
  service.post<boolean>('/system/role/menu/save', data)

export const updateRoleStatus = (data: { id: string; status: number }) =>
  service.post<boolean>('/system/role/status', data)
