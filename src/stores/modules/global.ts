import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const isCollapse = ref(false)
  const toggleCollapse = () => {
    isCollapse.value = !isCollapse.value
  }

  // 1. 定义暗黑模式状态
  const isDark = ref(false)

  // 从 localStorage 读取初始值
  const savedDark = localStorage.getItem('global_isDark')
  if (savedDark !== null) {
    isDark.value = savedDark === 'true'
  }

  // 2. 监听 isDark 的变化，自动保存到 localStorage
  watch(isDark, (newValue) => {
    localStorage.setItem('global_isDark', newValue.toString())
  })

  // 3. 修改方法（保持原来的接口不变）
  const setGlobalState = (key: string, value: any) => {
    if (key === 'isDark') {
      isDark.value = value
      // watch 会自动触发保存，这里不需要重复写 localStorage
    }
  }

  return { isCollapse, toggleCollapse, isDark, setGlobalState }
})
