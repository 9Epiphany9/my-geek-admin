<script setup lang="ts">
import { ref } from 'vue'
import { User, Lock, CircleClose, UserFilled } from '@element-plus/icons-vue'
import type { FormInstance } from 'element-plus'
import { loginApi } from '@/api/modules/login'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const userStore = useUserStore()
//  登录校验
const loginFormRef = ref()
const loginForm = ref({
  username: '',
  password: '',
})
const loginRules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
})
const loading = ref(false)
// 重置逻辑
const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
const login = (formEl: FormInstance | undefined) => {
  // 这里的 formEl 就是那个 ref
  if (!formEl) return

  // validate 是 Element Plus 自带的校验方法
  formEl.validate(async (valid: boolean) => {
    if (!valid) return
    // 校验通过，开始模拟登录
    loading.value = true
    try {
      const res: any = await loginApi({
        username: loginForm.value.username,
        password: loginForm.value.password,
      })
      console.log(res)
      userStore.setToken(res.access_token)
      // 4. 跳转首页
      router.push('/')
    } catch (error) {
      console.error(error)
    } finally {
      loading.value = false
    }
  })
}
</script>

<template>
  <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules" size="large">
    <el-form-item prop="username">
      <el-input v-model="loginForm.username" placeholder="用户名：admin / user">
        <template #prefix>
          <el-icon class="el-input__icon">
            <user />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="loginForm.password"
        type="password"
        placeholder="密码：123456"
        show-password
      >
        <template #prefix>
          <el-icon class="el-input__icon">
            <lock />
          </el-icon>
        </template>
      </el-input>
    </el-form-item>
  </el-form>
  <div class="login-btn">
    <el-button :icon="CircleClose" round size="large" @click="resetForm(loginFormRef)">
      重置
    </el-button>
    <el-button
      :icon="UserFilled"
      round
      size="large"
      type="primary"
      :loading="loading"
      @click="login(loginFormRef)"
    >
      登录
    </el-button>
  </div>
</template>

<style scoped lang="scss">
@use '../index.scss';
</style>
