<template>
  <div class="home card">
    <div class="header">
      <img class="header-img" src="@/assets/images/avatar.gif" alt="avatar" />
      <div class="header-content">
        <div class="title">早安，管理员，开始您一天的工作吧！</div>
        <div class="sub-title">今日天气晴朗，气温 20℃ - 32℃！</div>
      </div>
    </div>

    <div class="bottom-box">
      <div class="echarts-box">
        <div class="chart-title">访问量趋势</div>
        <div ref="echartsRef" class="echarts-content"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'
import { useEcharts } from '@/hooks/useEcharts'

// 1. 获取 DOM 元素引用
const echartsRef = ref<HTMLElement>()

// 2. 页面挂载后初始化图表
onMounted(() => {
  // 初始化 echarts 实例
  const myChart: echarts.EChartsType = echarts.init(echartsRef.value as HTMLElement)

  // 定义配置项
  const option: echarts.EChartsCoreOption = {
    tooltip: {
      trigger: 'axis',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '访问量',
        type: 'line',
        stack: 'Total',
        smooth: true, // 平滑曲线
        areaStyle: {}, // 区域填充颜色
        data: [120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: '订单量',
        type: 'line',
        stack: 'Total',
        smooth: true,
        areaStyle: {},
        data: [220, 182, 191, 234, 290, 330, 310],
      },
    ],
  }

  // 3. 调用我们封装的 Hook
  useEcharts(myChart, option)
})
</script>

<style scoped lang="scss">
.home {
  height: 100%;
  display: flex;
  flex-direction: column;

  .header {
    display: flex;
    align-items: center;
    padding: 20px 40px;
    background-color: #fff;
    border-bottom: 1px solid #e4e7ed;
    margin-bottom: 20px;
    .header-img {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      margin-right: 20px;
    }
    .title {
      font-size: 20px;
      font-weight: bold;
      color: #303133;
      margin-bottom: 10px;
    }
    .sub-title {
      font-size: 14px;
      color: #909399;
    }
  }

  .bottom-box {
    flex: 1;
    display: flex;
    background: #fff;
    padding: 20px;

    .echarts-box {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;

      .chart-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 15px;
        color: #303133;
      }

      .echarts-content {
        flex: 1;
        width: 100%;
        min-height: 300px; /* 兜底高度 */
      }
    }
  }
}
</style>
