import { service } from '@/api/index'

// 模拟的后端菜单数据（根据你的 views 目录结构来写）
// 假设你有 views/home/index.vue 和 views/system/user/index.vue
export const getAuthMenuListApi = () => service.get('/auth/menu').then((data) => ({ data }))

// 在之前的菜单接口里，或者单独的 userInfo 接口里
export const getUserPermissionApi = () => service.get('/auth/buttons').then((data) => ({ data }))
