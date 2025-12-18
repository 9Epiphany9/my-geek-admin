import type { Directive, DirectiveBinding } from 'vue'

interface ElType extends HTMLElement {
  __handleClick__: () => any
}

const debounce: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    if (typeof binding.value !== 'function') {
      throw 'callback must be a function'
    }

    let timer: NodeJS.Timeout | null = null

    el.__handleClick__ = function () {
      if (timer) {
        // 如果定时器还在，说明还在冷却中，不执行
        return
      }

      // 1. 立即执行传入的函数
      binding.value()

      // 2. 开启冷却 (默认 500ms)
      timer = setTimeout(() => {
        timer = null
      }, 500)
    }

    el.addEventListener('click', el.__handleClick__)
  },

  beforeUnmount(el: ElType) {
    el.removeEventListener('click', el.__handleClick__)
  },
}

export default debounce
