<script setup lang="ts">
import { useTabsStore } from '@/stores/modules/tabs'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { TabsPaneContext } from 'element-plus'
const route = useRoute()
const router = useRouter()
const tabsStore = useTabsStore()
// tab 高亮显示
const activeTab = ref(route.path)
// 监听路由变化
watch(
  () => route.path,
  () => {
    activeTab.value = route.path
    tabsStore.addTab({
      title: route.meta.title as string,
      path: route.path,
      name: route.name as string,
      icon: route.meta.icon as string,
      close: true,
    })
  },
  { immediate: true },
)
// 点击Tab切换路由
const tabClick = (tab: TabsPaneContext) => {
  const fullPath = tab.props.name as string // 1. 获取标签页的路由路径
  router.push(fullPath) // 2. 跳转到该路径
}

// 移除Tab
const removeTab = (fullPath: string | number) => {
  const path = fullPath as string

  // 1. 如果删的是当前激活的 Tab
  if (activeTab.value === path) {
    // 找到被删 Tab 的位置
    tabsStore.tabsList.forEach((item, index) => {
      if (item.path !== path) return
      // 逻辑：跳到它后面一个，如果没有后面，就跳前面一个
      const nextTab = tabsStore.tabsList[index + 1] || tabsStore.tabsList[index - 1]
      if (nextTab) {
        router.push(nextTab.path)
      }
    })
  }

  // 2. 调用 Store 删除数据
  tabsStore.removeTab(path)
}
</script>

<template>
  <div class="tabs-box">
    <el-tabs v-model="activeTab" type="card" @tab-click="tabClick" @tab-remove="removeTab">
      <el-tab-pane
        v-for="item in tabsStore.tabsList"
        :key="item.path"
        :label="item.title"
        :name="item.path"
        :closable="item.close !== false"
      >
        <template #label>
          <el-icon v-if="item.icon" class="tabs-icon">
            <component :is="item.icon"></component>
          </el-icon>
          {{ item.title }}
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<style scoped>
.tabs-box {
  background-color: #ffffff;
  padding: 0 10px;
  /* 稍微把 Tab 往下压一点，好看点 */
  /* border-bottom: 1px solid #e4e7ed; */
}

.tabs-icon {
  margin-right: 5px;
  vertical-align: middle;
}

/* 覆盖 Element Plus 默认样式，让它更好看（可选） */
:deep(.el-tabs__header) {
  margin: 0;
}
:deep(.el-tabs__nav) {
  border: none !important;
}
:deep(.el-tabs__item) {
  color: #cccccc;
  border: none !important;
}
:deep(.el-tabs__item.is-active) {
  color: #409eff;
  border-bottom: 2px solid #409eff !important;
}
</style>
