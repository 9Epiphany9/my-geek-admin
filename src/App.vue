<template>
  <el-config-provider :locale="zhCn" :size="assemblySize" :button="buttonConfig">
    <router-view />
  </el-config-provider>
</template>

<script setup lang="ts">
import { onMounted, reactive, computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn' // 1. 引入中文包
import { useTheme } from '@/hooks/useTheme'
import { useGlobalStore } from '@/stores/modules/global'

const globalStore = useGlobalStore()
const { switchDark } = useTheme()

// 2. 初始化主题配置
onMounted(() => {
  switchDark()
})

// 3. 定义配置项
// 这里先写死为 'default'，以后你可以在 GlobalStore 里加个 assemblySize 状态来动态控制
const assemblySize = computed(() => 'default')

// 4. 按钮配置（自动在两个中文字符之间插入空格）
const buttonConfig = reactive({ autoInsertSpace: true })
</script>
