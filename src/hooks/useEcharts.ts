import { onDeactivated, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

/**
 * @description 使用 ECharts (配合 Vue Ref)
 * @param myChart - ECharts 实例的引用 (Ref)
 * @param options - 图表配置项 (Ref 或 对象)
 */
export const useEcharts = (myChart: echarts.EChartsType, options: echarts.EChartsCoreOption) => {
  // 1. 设置配置项 (可以理解为初始化画图)
  if (options && typeof options === 'object') {
    myChart.setOption(options)
  }

  // 2. 核心功能：监听窗口大小变化，自动重绘
  const echartsResize = () => {
    myChart && myChart.resize()
  }

  // 3. 绑定监听器
  window.addEventListener('resize', echartsResize)

  // 4. 销毁时移除监听器 (防止内存泄漏)
  // 比如切换 Tab 或者离开页面时
  const removeResize = () => {
    window.removeEventListener('resize', echartsResize)
  }

  onBeforeUnmount(() => {
    removeResize()
  })

  // 配合 Keep-Alive 的生命周期
  onDeactivated(() => {
    removeResize()
  })

  return {
    echartsResize,
  }
}
