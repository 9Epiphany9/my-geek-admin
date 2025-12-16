import { storeToRefs } from 'pinia'
import { useGlobalStore } from '@/stores/modules/global'

export const useTheme = () => {
  const globalStore = useGlobalStore()
  const { isDark } = storeToRefs(globalStore)

  // 切换暗黑模式
  const switchDark = () => {
    const html = document.documentElement as HTMLElement
    if (isDark.value) {
      html.setAttribute('class', 'dark')
    } else {
      html.setAttribute('class', '')
    }
  }

  return {
    switchDark,
  }
}
