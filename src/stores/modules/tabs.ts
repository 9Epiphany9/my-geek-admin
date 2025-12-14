import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export interface TabItem {
  title: string
  path: string
  name: string
  icon?: string
  close?: boolean
}

export const useTabsStore = defineStore('tabs', () => {
  const tabsList = ref<TabItem[]>([
    { title: '首页', path: '/home', icon: 'HomeFilled', close: false, name: 'Home' },
  ])
  // 添加标签页
  function addTab(tab: TabItem) {
    // 判断是否已经存在
    if (tabsList.value.every((item) => item.path !== tab.path)) tabsList.value.push(tab)
  }
  // 3. 移除标签
  function removeTab(path: string) {
    if (path === '/home') return // 首页不能删

    // 调试大法：看看传进来的 path 和 列表里的 item.path 是否一致
    // console.log("准备删除:", path);
    // console.log("当前列表:", tabsList.value);

    // 重新赋值给 tabsList.value，确保 Vue 能监测到变化
    tabsList.value = tabsList.value.filter((item) => item.path !== path)
  }

  // 计算出需要缓存的 name 数组，比如 ["Home", "User"]
  const keepAliveName = computed(() => {
    return tabsList.value.map((item) => item.name)
  })

  return { tabsList, addTab, removeTab, keepAliveName }
})
