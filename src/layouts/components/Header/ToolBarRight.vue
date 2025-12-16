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
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGlobalStore } from '@/stores/modules/global'
import { useTheme } from '@/hooks/useTheme'
import { storeToRefs } from 'pinia'
import { Sunny, Moon } from '@element-plus/icons-vue'

const globalStore = useGlobalStore()
const { isDark } = storeToRefs(globalStore)
const { switchDark } = useTheme()
</script>

<style scoped>
/* 稍微调整下图标大小 */
.header-icon {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
</style>
