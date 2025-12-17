<template>
  <el-dialog v-model="dialogVisible" title="修改密码" width="500px" draggable>
    <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input
          v-model="ruleForm.oldPassword"
          type="password"
          placeholder="请输入旧密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input
          v-model="ruleForm.newPassword"
          type="password"
          placeholder="请输入新密码"
          show-password
        />
      </el-form-item>
      <el-form-item label="确认密码" prop="confirmPassword">
        <el-input
          v-model="ruleForm.confirmPassword"
          type="password"
          placeholder="请再次输入新密码"
          show-password
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, type FormInstance } from 'element-plus'
import { changePasswordApi } from '@/api/modules/user'
import { useUserStore } from '@/stores/modules/user'
import { useRouter } from 'vue-router'

const dialogVisible = ref(false)
const ruleFormRef = ref<FormInstance>()
const userStore = useUserStore()
const router = useRouter()

// 定义表单数据
const ruleForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: '',
})

// ✨ 核心知识点：自定义校验规则
// 用于校验"确认密码"是否与"新密码"一致
const validateConfirmPassword = (rule: any, value: string, callback: any) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== ruleForm.newPassword) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 表单规则
const rules = reactive({
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' },
  ],
  confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }],
})

// 打开弹窗的方法 (暴露给父组件)
const openDialog = () => {
  dialogVisible.value = true
  // 重置表单 (防止上次输入的内容还在)
  // nextTick 确保弹窗渲染出来后再重置，否则可能报错
  setTimeout(() => {
    ruleFormRef.value?.resetFields()
  }, 0)
}

// 提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (!valid) return
    try {
      await changePasswordApi(ruleForm)
      ElMessage.success('修改密码成功，请重新登录')
      dialogVisible.value = false

      // 密码改了，通常需要强制退出重新登录
      userStore.setToken('')
      router.replace('/login')
    } catch (error) {
      console.log(error)
    }
  })
}

// 暴露给父组件
defineExpose({ openDialog })
</script>
