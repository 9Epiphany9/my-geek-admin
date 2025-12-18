import type { Directive, DirectiveBinding } from 'vue'
import { ElMessage } from 'element-plus'

interface ElType extends HTMLElement {
  copyData: string | number
  __handleClick__: any
}

const copy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    // 1. 把要复制的值存下来
    el.copyData = binding.value

    // 2. 定义点击行为
    el.__handleClick__ = async function () {
      try {
        // 使用现代 API 复制
        await navigator.clipboard.writeText(el.copyData.toString())
        ElMessage.success('复制成功')
      } catch (error) {
        ElMessage.error('复制失败')
        console.error('复制失败:', error)
      }
    }

    // 3. 绑定点击事件
    el.addEventListener('click', el.__handleClick__)
  },

  updated(el: ElType, binding: DirectiveBinding) {
    // 数据变了，也要更新
    el.copyData = binding.value
  },

  beforeUnmount(el: ElType) {
    // 销毁时解绑，防止内存泄漏
    el.removeEventListener('click', el.__handleClick__)
  },
}

export default copy
