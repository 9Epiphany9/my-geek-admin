import { ref, onBeforeUnmount } from 'vue'

export const useWatermark = (appendEl: HTMLElement | null = document.body) => {
  const id = '1.2.3.4.5.6' // 一个特殊的 ID，防止跟业务 ID 冲突
  const watermarkEl = ref<HTMLElement | null>(null)

  /**
   * @description 创建水印图片
   */
  const createBase64 = (str: string) => {
    const can = document.createElement('canvas')
    const width = 200
    const height = 210
    Object.assign(can, { width, height })

    const cans = can.getContext('2d')
    if (cans) {
      cans.rotate((-20 * Math.PI) / 180) // 旋转 -20 度
      cans.font = '15px Vedana'
      cans.fillStyle = 'rgba(200, 200, 200, 0.20)' // 浅灰色，透明度 0.2
      cans.textAlign = 'left'
      cans.textBaseline = 'middle'
      cans.fillText(str, width / 20, height) // 在画布上画字
    }
    return can.toDataURL('image/png') // 转成 Base64 字符串
  }

  /**
   * @description 设置水印
   */
  const setWatermark = (str: string) => {
    // 1. 如果已有，先删掉
    if (document.getElementById(id) !== null) {
      document.body.removeChild(document.getElementById(id) as HTMLElement)
    }

    // 2. 创建一个 div
    const div = document.createElement('div')
    div.id = id
    div.style.pointerEvents = 'none' // 关键：让鼠标事件穿透，不影响点击下面的按钮
    div.style.top = '0px'
    div.style.left = '0px'
    div.style.position = 'fixed'
    div.style.zIndex = '100000'
    div.style.width = document.documentElement.clientWidth + 'px'
    div.style.height = document.documentElement.clientHeight + 'px'

    // 3. 把刚才画的图作为背景铺满
    div.style.background = `url(${createBase64(str)}) left top repeat`

    // 4. 放到页面上
    document.body.appendChild(div)
    watermarkEl.value = div
  }

  /**
   * @description 清除水印 (退出登录时用)
   */
  const clear = () => {
    const domId = document.getElementById(id)
    if (domId) {
      const parent = domId.parentNode
      if (parent) parent.removeChild(domId)
    }
    window.removeEventListener('resize', () => {})
  }

  // 页面销毁时自动清除
  onBeforeUnmount(() => {
    clear()
  })

  return { setWatermark, clear }
}
