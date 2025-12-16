import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getAuthMenuListApi, getUserPermissionApi } from '@/api/modules/auth'

// 定义菜单项的接口（TS类型）
export interface MenuOptions {
  path: string
  name: string
  component?: string | (() => Promise<unknown>)
  redirect?: string
  meta: {
    icon: string
    title: string
    isHide: boolean
    isFull: boolean
    isAffix: boolean
    isKeepAlive: boolean
  }
  children?: MenuOptions[]
}

export const useAuthStore = defineStore('auth', () => {
  // 1. 定义 State：菜单列表
  const authMenuList = ref<MenuOptions[]>([])

  // 2.按钮权限列表
  const authButtonList = ref<string[]>([])

  // 3.获取按钮权限的 action
  async function getAuthButtonList() {
    const { data } = await getUserPermissionApi()
    authButtonList.value = data
  }

  // 2. Action：获取后端菜单数据
  async function getAuthMenuList() {
    const { data } = await getAuthMenuListApi()
    authMenuList.value = data
  }

  // 3. Getter: 提供给侧边栏使用的菜单（将来可能需要过滤掉 hidden 的）
  const showMenuListGet = computed(() => authMenuList.value)

  return { authMenuList, getAuthMenuList, showMenuListGet, authButtonList, getAuthButtonList }
})
