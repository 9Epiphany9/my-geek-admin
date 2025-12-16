/**
 * v-auth
 * 按钮权限指令
 */
import { useAuthStore } from '@/stores/modules/auth'
import type { Directive, DirectiveBinding } from 'vue'

const auth: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const { value } = binding // 拿到 v-auth="['user:add']" 里的值
    const authStore = useAuthStore()

    // 拿到当前用户拥有的所有按钮权限
    const currentPageRoles = authStore.authButtonList ?? []

    // 判断：如果 value 是个数组，只要满足其中一个就有权限
    // 如果 value 是个字符串，直接判断
    if (value instanceof Array && value.length > 0) {
      const hasPermission = value.every((role) => currentPageRoles.includes(role))
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el) // 没权限，把自己删掉
      }
    } else {
      if (!currentPageRoles.includes(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    }
  },
}

export default auth
