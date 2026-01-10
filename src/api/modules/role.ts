import { service } from '@/api/index'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getRoleList = (params: any) => service.get('/system/role/list', { params })

export const getMenuList = () => service.get('/system/menu/list')

export const getRoleMenu = (params: { roleId: string }) =>
  service.get('/system/role/menu', { params })

export const saveRoleMenu = (data: { roleId: string; menuIds: string[] }) =>
  service.post('/system/role/menu/save', data)
