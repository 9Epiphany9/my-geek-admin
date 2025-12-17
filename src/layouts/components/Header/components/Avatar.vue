<template>
  <el-dropdown trigger="click">
    <div class="avatar">
      <img src="@/assets/images/avatar.gif" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="openDialog('info')">
          <el-icon><User /></el-icon>个人信息
        </el-dropdown-item>

        <el-dropdown-item @click="openDialog('password')">
          <el-icon><Edit /></el-icon>修改密码
        </el-dropdown-item>

        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>

  <PasswordDialog ref="passwordRef" />
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { ElMessageBox, ElMessage } from 'element-plus'
import PasswordDialog from './PasswordDialog.vue'
import { ref } from 'vue'
const passwordRef = ref()
const router = useRouter()
const userStore = useUserStore()

// 1. 退出登录核心逻辑
const logout = () => {
  ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 1. 调用退出登录接口 (如果没有后端，这步可以省略，直接清除本地)
    // await logoutApi();

    // 2. 清除 Token 和用户信息
    userStore.setToken('')

    // 3. 清除其他可能的持久化数据 (可选)
    localStorage.removeItem('geeker-global')
    localStorage.removeItem('geeker-tabs')

    // 4. 提示并跳转
    ElMessage.success('退出登录成功！')
    router.replace('/login')
  })
}

// 打开弹窗
const openDialog = (type: string) => {
  if (type === 'info') {
    ElMessage.info('个人信息模块暂未开发')
  } else {
    // 4. 调用子组件暴露的 openDialog 方法
    passwordRef.value?.openDialog()
  }
}
</script>

<style scoped lang="scss">
.avatar {
  width: 40px;
  height: 40px;
  overflow: hidden;
  cursor: pointer;
  border-radius: 50%;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>
