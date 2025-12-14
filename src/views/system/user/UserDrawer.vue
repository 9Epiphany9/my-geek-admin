<template>
  <el-drawer
    v-model="drawerVisible"
    :destroy-on-close="true"
    size="450px"
    :title="`${drawerProps.title}用户`"
  >
    <el-form
      ref="ruleFormRef"
      label-width="100px"
      label-suffix=" :"
      :rules="rules"
      :model="drawerProps.row"
    >
      <el-form-item label="用户姓名" prop="username">
        <el-input
          v-model="drawerProps.row!.username"
          placeholder="请填写用户姓名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select v-model="drawerProps.row!.gender" placeholder="请选择性别" clearable>
          <el-option label="男" :value="1" />
          <el-option label="女" :value="2" />
        </el-select>
      </el-form-item>
      <el-form-item label="年龄" prop="age">
        <el-input
          v-model.number="drawerProps.row!.age"
          placeholder="请填写年龄"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="drawerProps.row!.email" placeholder="请填写邮箱" clearable></el-input>
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, FormInstance } from 'element-plus'
import { addUser, editUser } from '@/api/modules/user'

// 定义表单校验规则
const rules = reactive({
  username: [{ required: true, message: '请填写用户姓名' }],
  gender: [{ required: true, message: '请选择性别' }],
  age: [{ required: true, message: '请填写年龄' }],
  email: [{ required: true, message: '请填写邮箱' }],
})

// 定义 drawer 的状态
interface DrawerProps {
  title: string
  isView: boolean
  row: any
  api?: (params: any) => Promise<any>
  getTableList?: () => void // 刷新表格的方法
}

const drawerVisible = ref(false)
const drawerProps = ref<DrawerProps>({
  isView: false,
  title: '',
  row: {},
})

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps) => {
  drawerProps.value = params
  drawerVisible.value = true
}

// 提交数据（新增或编辑）
const ruleFormRef = ref<FormInstance>()
const handleSubmit = () => {
  ruleFormRef.value!.validate(async (valid) => {
    if (!valid) return
    try {
      // 这里的 logic 很有趣：
      // 我们不需要在组件里 if (isAdd) addUser else editUser
      // 而是让父组件把 "api" 函数传进来，我只管执行 api(params) 就行！
      await drawerProps.value.api!(drawerProps.value.row)

      ElMessage.success({ message: `${drawerProps.value.title}用户成功！` })
      drawerProps.value.getTableList!() // 刷新父组件的表格
      drawerVisible.value = false
    } catch (error) {
      console.log(error)
    }
  })
}

// 暴露给父组件调用
defineExpose({
  acceptParams,
})
</script>
