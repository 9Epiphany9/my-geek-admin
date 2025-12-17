<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <el-switch
        v-model="isDark"
        inline-prompt
        :active-icon="Sunny"
        :inactive-icon="Moon"
        @change="switchDark"
      />
      <span class="username">Admin</span>

      <Avatar />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global'
import { useTheme } from '@/hooks/useTheme'
import { storeToRefs } from 'pinia'
import Avatar from '@/layouts/components/Header/components/Avatar.vue'
const globalStore = useGlobalStore()
const { isDark } = storeToRefs(globalStore)
const { switchDark } = useTheme()
</script>

<style scoped lang="scss">
/* 稍微调整下图标大小 */
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    // margin-right: 20px; // 可以稍微调整间距
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
    color: var(--el-text-color-primary); // 记得用变量
  }
}
</style>
