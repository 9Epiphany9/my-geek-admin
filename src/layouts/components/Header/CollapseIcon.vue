<template>
  <el-icon class="collapse-icon" @click="globalStore.toggleCollapse()">
    <component :is="globalStore.isCollapse ? 'Expand' : 'Fold'"></component>
  </el-icon>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global'
const globalStore = useGlobalStore()
</script>

<style scoped>
.collapse-icon {
  margin-right: 20px;
  font-size: 22px;
  cursor: pointer;
  color: #303133;
}
</style>
