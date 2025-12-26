<template>
  <div class="viewport" ref="viewportRef" @scroll="handleScroll">
    <div class="phantom" :style="{ height: totalHeight + 'px' }"></div>

    <div class="render-list" :style="{ transform: `translate3d(0, ${offset}px, 0)` }">
      <div
        class="item"
        v-for="item in renderData"
        :key="item.id"
        :style="{ height: itemHeight + 'px' }"
      >
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  listData: { type: Array, default: () => [] }, // 所有数据
  itemHeight: { type: Number, default: 50 }, // 每行固定高度
})

// 状态
const viewportRef = ref<HTMLElement | null>(null)
const scrollTop = ref(0)
const viewHeight = 500 // 假设容器高度是 500 (可以通过 DOM 获取)

// 1. 总高度 = 数据量 * 每行高度
const totalHeight = computed(() => props.listData.length * props.itemHeight)

// 2. 计算当前应该显示的列表 (核心!)
const renderData = computed(() => {
  // 算出开始索引：滚过去的距离 / 单行高度
  const start = Math.floor(scrollTop.value / props.itemHeight)
  // 算出结束索引：开始索引 + (容器高度 / 单行高度)
  // 多渲染 2 个防止滚动留白 (Buffer)
  const end = start + Math.ceil(viewHeight / props.itemHeight) + 2

  return props.listData.slice(start, end)
})

// 3. 计算偏移量 (让列表一直跟着视口走)
const offset = computed(() => {
  return scrollTop.value - (scrollTop.value % props.itemHeight)
})

// 监听滚动
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollTop.value = target.scrollTop
}
</script>

<style scoped>
.viewport {
  height: 500px;
  overflow-y: auto;
  position: relative;
  border: 1px solid #ccc;
}
.phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}
.render-list {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
}
.item {
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  padding-left: 20px;
}
</style>
