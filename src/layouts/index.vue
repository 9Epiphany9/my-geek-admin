<template>
  <el-container class="layout-container">
    <el-aside
      width="200px"
      class="layout-aside"
      :style="{ width: globalStore.isCollapse ? '65px' : '200px' }"
    >
      <div class="aside-logo">Geeker Admin</div>
      <el-menu
        background-color="#191a20"
        text-color="#bdbdc0"
        active-text-color="#fff"
        :default-active="activeMenu"
        :router="true"
        :collapse="globalStore.isCollapse"
        :collapse-transition="false"
      >
        <SubMenu :menuList="menuList" />
      </el-menu>
    </el-aside>

    <el-container>
      <el-header class="layout-header">
        <div class="header-left">
          <CollapseIcon />
          <Breadcrumb />
        </div>

        <div class="header-right">
          <span class="username">Admin</span>
          <el-button size="small" type="danger" link @click="logout">退出登录</el-button>
        </div>
      </el-header>
      <Tabs></Tabs>
      <el-main class="layout-main">
        <router-view v-slot="{ Component, route }">
          <transition name="fade-transform" mode="out-in">
            <keep-alive :include="tabsStore.keepAliveName">
              <component :is="Component" :key="route.fullPath" />
            </keep-alive>
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import Tabs from './components/Tabs/index.vue'
const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// 自动高亮当前菜单
const activeMenu = computed(() => route.path)

const logout = () => {
  userStore.setToken('') // 清空 Token
  router.push('/login') // 回登录页
}
// 侧边栏
import CollapseIcon from './components/Header/CollapseIcon.vue' // 引入折叠组件
import { useGlobalStore } from '@/stores/modules/global' // 引入 Store

const globalStore = useGlobalStore() // 实例化 Store

import SubMenu from './components/Menu/SubMenu.vue'

const menuList = [
  {
    path: '/home',
    meta: {
      title: '首页',
      icon: 'HomeFilled',
    },
  },
  {
    path: '/system',
    redirect: '/system/user',
    meta: {
      title: '系统管理',
      icon: 'Setting',
    },
    // 注意：这里有了 children，说明它有子菜单
    children: [
      {
        path: '/system/user',
        meta: {
          title: '用户管理',
          icon: 'User',
        },
      },
      {
        path: '/system/role',
        meta: {
          title: '角色管理',
          icon: 'Avatar',
        },
      },
    ],
  },
]

// 面包屑导航
import Breadcrumb from './components/Header/Breadcrumb.vue'

// 持久化存储
import { useTabsStore } from '@/stores/modules/tabs'
const tabsStore = useTabsStore()
</script>

<style scoped>
.layout-container {
  height: 100vh; /* 强制占满视口高度 */
}
.aside-logo {
  height: 55px;
  line-height: 55px;
  text-align: center;
  font-weight: bold;
  font-size: 20px;
  border-bottom: 1px solid #282a35;
}
.layout-header {
  background-color: #ffffff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between; /* 左右两边撑开 */
  padding: 0 20px;
  height: 55px; /* 固定高度 */
}

.header-left {
  display: flex;
  align-items: center;
}

.header-right {
  display: flex;
  align-items: center;
}

.username {
  margin-right: 15px;
  font-size: 14px;
  color: #333;
}
.layout-main {
  background-color: #f0f2f5; /* 给个灰色背景，显出层次感 */
  padding: 10px;
}

.layout-aside {
  background-color: #191a20;
  color: white;
  display: flex;
  flex-direction: column;
  /* 3. 加上丝滑的过渡动画 */
  transition: width 0.3s ease;
  overflow: hidden; /* 防止文字折叠时溢出 */
}

/* 解决 Element Plus 菜单折叠后的边框问题 */
.el-menu {
  border-right: none;
}

/* 简单的淡入淡出位移效果 */
.fade-transform-leave-active,
.fade-transform-enter-active {
  transition: all 0.5s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
