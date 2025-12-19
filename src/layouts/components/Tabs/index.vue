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

// ================= 右键菜单逻辑 =================

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedPath = ref('') // 记录右键点的是哪个 Tab 的路径

// 1. 打开菜单
const onContextMenu = (e: MouseEvent, item: any) => {
  // 禁止浏览器默认菜单 (在 template 里用了 .prevent 其实这里就不用写了)
  // e.preventDefault();

  visible.value = true
  left.value = e.clientX // 鼠标横坐标
  top.value = e.clientY + 10 // 鼠标纵坐标 (稍微往下一点)
  selectedPath.value = item.path // 记住点的是谁
}

// 2. 关闭菜单 (监听全局点击)
watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

const closeMenu = () => {
  visible.value = false
}

// --- 菜单按钮事件 ---

// 刷新当前 (这是一个高阶功能，原理是先销毁组件再重建)
// 简单起见，你可以先留空，或者只是重新加载路由
const refreshCurrentPage = () => {
  // 比较复杂的逻辑：通常是配合 KeepAlive 的 exclude 属性，
  // 先把当前页从缓存清除，跳转到一个空白页，再跳回来。
  // 这里我们先模拟一下：
  /* const currentName = route.name as string;
  tabsStore.removeKeepAliveName(currentName); // 这一步需要 store 支持
  nextTick(() => {
     router.replace({ path: "/redirect" + selectedPath.value });
  });
  */
  console.log('刷新功能暂未实现')
}

// 关闭当前
const closeCurrent = () => {
  removeTab(selectedPath.value)
}

// 关闭其他
const closeOther = () => {
  tabsStore.closeMultipleTab(selectedPath.value)
  router.push(selectedPath.value) // 跳转到当前保留的这个
}

// 关闭所有
const closeAll = () => {
  tabsStore.closeMaximize()
  router.push('/home')
}
</script>

<template>
  <div class="tabs-box">
    <div class="tabs-menu">
      <el-tabs v-model="activeTab" type="card" @tab-click="tabClick" @tab-remove="removeTab">
        <el-tab-pane
          v-for="item in tabsStore.tabsList"
          :key="item.path"
          :label="item.title"
          :name="item.path"
          :closable="item.close"
        >
          <template #label>
            <span class="tab-label" @contextmenu.prevent="onContextMenu($event, item)">
              <el-icon v-if="item.icon" class="tabs-icon">
                <component :is="item.icon"></component>
              </el-icon>
              {{ item.title }}
            </span>
          </template>
        </el-tab-pane>
      </el-tabs>

      <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
        <li @click="refreshCurrentPage">
          <el-icon><Refresh /></el-icon> 刷新当前
        </li>
        <li @click="closeCurrent">
          <el-icon><Remove /></el-icon> 关闭当前
        </li>
        <li @click="closeOther">
          <el-icon><CircleClose /></el-icon> 关闭其他
        </li>
        <li @click="closeAll">
          <el-icon><FolderDelete /></el-icon> 关闭所有
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tabs-box {
  background-color: var(--el-bg-color);
  .tabs-menu {
    position: relative;
    width: 100%;

    // 调整一下 element tabs 的默认样式
    :deep(.el-tabs__header) {
      box-sizing: border-box;
      height: 40px;
      padding: 0 10px;
      margin: 0;
      .el-tabs__nav-wrap {
        position: absolute;
        width: 100%;
        .el-tabs__nav {
          display: flex;
          border: none;
          .el-tabs__item {
            display: flex;
            align-items: center;
            justify-content: center;
            color: #cccccc;
            border: none;
            // 选中的样式
            &.is-active {
              color: var(--el-color-primary);
              border-bottom: 2px solid var(--el-color-primary);
            }
            // 自定义 slot 里的样式
            .tab-label {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 100%;
              height: 100%; // 撑满，为了让右键点击更容易触发
              .tabs-icon {
                margin-right: 5px;
                font-size: 16px;
              }
            }
          }
        }
      }
    }
  }

  // 右键菜单样式
  .contextmenu {
    position: fixed; // 必须是 fixed，参照屏幕
    z-index: 3000;
    width: 100px; // 稍微宽一点
    padding: 5px 0;
    margin: 0;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    list-style-type: none;
    background: #fff;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    border-radius: 4px;

    li {
      display: flex;
      align-items: center;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
        color: var(--el-color-primary);
      }
      .el-icon {
        margin-right: 5px;
      }
    }
  }
}
</style>
