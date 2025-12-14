<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

// 计算属性：自动获取当前路由的所有父级
// 比如访问 /system/user，matched 里就会有 [/system, /system/user] 两个对象
const breadcrumbList = computed(() => {
  return route.matched.filter((item) => item.meta && item.meta.title)
})

const onBreadcrumbClick = (item: any) => {
  if (item.redirect) {
    router.push(item.redirect)
  } else {
    router.push(item.path)
  }
}
</script>

<template>
  <el-breadcrumb separator-icon="ArrowRight">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in breadcrumbList" :key="item.path">
        <span v-if="index === breadcrumbList.length - 1" class="no-redirect">
          <el-icon v-if="item.meta.icon" class="breadcrumb-icon">
            <component :is="item.meta.icon"></component>
          </el-icon>
          {{ item.meta.title }}
        </span>

        <a v-else @click.prevent="onBreadcrumbClick(item)">
          <el-icon v-if="item.meta.icon" class="breadcrumb-icon">
            <component :is="item.meta.icon"></component>
          </el-icon>
          {{ item.meta.title }}
        </a>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<style scoped>
/* 让图标和文字对齐 */
.breadcrumb-icon {
  margin-right: 4px;
  font-size: 16px;
  vertical-align: top; /* 微调图标位置 */
  margin-top: 2px;
}

.no-redirect {
  color: #606266;
  font-weight: 600;
  cursor: text;
}

/* 简单的进场动画 */
.breadcrumb-enter-active,
.breadcrumb-leave-active {
  transition: all 0.5s;
}
.breadcrumb-enter-from,
.breadcrumb-leave-active {
  opacity: 0;
  transform: translateX(20px);
}
.breadcrumb-leave-active {
  position: absolute;
}
</style>
