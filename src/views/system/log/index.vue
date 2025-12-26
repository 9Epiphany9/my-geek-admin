<template>
  <div class="card content-box">
    <span class="text"> 系统日志 (模拟 10 万条数据) </span>

    <div class="virtual-box" v-bind="containerProps">
      <div v-bind="wrapperProps">
        <div v-for="item in list" :key="item.index" class="log-item" :style="{ height: '50px' }">
          <span class="index">#{{ item.index }}</span>
          <span class="message">{{ item.data }}</span>
          <span class="time">{{ item.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useVirtualList } from '@vueuse/core' // ✨ 引入神器

// 1. 制造 10 万条假数据
const allData = Array.from({ length: 100000 }, (_, index) => ({
  index: index + 1,
  data: `系统日志信息 - 这里的文本很长很长很长 ${Math.random().toString(36).slice(2)}`,
  time: new Date().toLocaleString(),
}))

// 2. 使用 useVirtualList Hook
const { list, containerProps, wrapperProps } = useVirtualList(
  allData, // 传入全部数据
  {
    itemHeight: 50, // 每一行的高度 (固定高度最简单，不定高稍微复杂点)
    overscan: 10, // 预加载数量 (防止滚动太快出现白屏)
  },
)
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

.virtual-box {
  flex: 1; // 占满剩余高度
  overflow-y: auto; // 必须有滚动条
  border: 1px solid #ebeef5;

  .log-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ebeef5;
    padding: 0 20px;
    box-sizing: border-box;

    .index {
      width: 80px;
      font-weight: bold;
      color: var(--el-color-primary);
    }
    .message {
      flex: 1;
    }
    .time {
      width: 180px;
      color: #999;
    }
  }
}
</style>
