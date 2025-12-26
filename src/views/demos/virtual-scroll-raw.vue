<template>
  <div class="card content-box">
    <span class="text"> 系统日志 (模拟 10 万条数据) </span>

    <MyVirtualScroll :listData="allData"></MyVirtualScroll>
  </div>
</template>

<script setup lang="ts">
import MyVirtualScroll from '@/components/demo/MyVirtualScroll.vue'
// 1. 制造 10 万条假数据
const allData = Array.from({ length: 100000 }, (_, index) => ({
  id: index + 1,
  content: `系统日志信息 - 这里的文本很长很长很长 ${Math.random().toString(36).slice(2)}`,
  time: new Date().toLocaleString(),
}))
</script>

<style scoped lang="scss">
.content-box {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.text {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
}
</style>
