<template>
  <template v-for="subItem in menuList" :key="subItem.path">
    <el-menu-item v-if="!subItem.children || subItem.children.length == 0" :index="subItem.path">
      <el-icon v-if="subItem.meta.icon">
        <component :is="subItem.meta.icon"></component>
      </el-icon>
      <template #title>
        <span>{{ subItem.meta.title }}</span>
      </template>
    </el-menu-item>

    <el-sub-menu v-else :index="subItem.path">
      <template #title>
        <el-icon v-if="subItem.meta.icon">
          <component :is="subItem.meta.icon"></component>
        </el-icon>
        <span>{{ subItem.meta.title }}</span>
      </template>

      <SubMenu :menuList="subItem.children" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
// 接收父组件传来的菜单列表
defineProps<{ menuList: any[] }>()
</script>

<script lang="ts">
export default {
  name: 'SubMenu',
}
</script>
