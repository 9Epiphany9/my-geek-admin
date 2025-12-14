<template>
  <div class="table-content">
    <ProTable ref="proTableRef" :columns="columns" :requestApi="getUserList">
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus" @click="openDrawer('新增')">新增用户</el-button>
      </template>

      <template #gender="scope">
        <el-tag>
          {{ scope.row.status === 1 ? '♂ ' : '♀' }}
        </el-tag>
      </template>

      <template #status="scope">
        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
          {{ scope.row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <template #operation="scope">
        <el-button type="primary" link icon="Edit" @click="openDrawer('编辑', scope.row)"
          >编辑</el-button
        >
        <el-button type="danger" link icon="Delete" @click="handleDelete(scope.row)"
          >删除</el-button
        >
      </template>
    </ProTable>
    <UserDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue'
import { getUserList, deleteUser, addUser, editUser } from '@/api/modules/user'
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
defineOptions({ name: 'User' })
import UserDrawer from './UserDrawer.vue' // 引入刚才写的组件
// 表格配置 (以后写页面主要就是写这个数组)
// src/views/system/user/index.vue
const columns = [
  { type: 'selection', fixed: 'left', width: 80 },
  { type: 'index', label: '#', width: 80 },
  {
    prop: 'username',
    label: '用户姓名',
    width: 120,
    // ✨ 新增：告诉 ProTable，这一列要搜索，用 input 框搜
    search: { el: 'input' },
  },
  { prop: 'gender', label: '性别', width: 100 },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'email', label: '邮箱' },
  {
    prop: 'status',
    label: '用户状态',
    width: 120,
    // ✨ 新增：告诉 ProTable，这一列要搜索，用 select 下拉框搜
    search: { el: 'select' },
    // 后面我们会讲怎么给 select 传 options，现在先留空
    enum: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 },
    ],
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 180 },
]

// 增 删 改

// 获取 Drawer 组件的引用
const drawerRef = ref()
const proTableRef = ref()

// 4. 打开抽屉的核心函数
const openDrawer = (title: string, row: any = {}) => {
  const params = {
    title,
    isView: title === '查看',
    row: { ...row }, // 复制一份数据，防止修改表单时直接影响表格显示
    api: title === '新增' ? addUser : editUser, // 关键：把要调用的 API 函数传过去
    getTableList: proTableRef.value?.getTableList, // 把刷新表格的方法传过去
  }

  // 调用子组件暴露出来的 acceptParams 方法
  drawerRef.value?.acceptParams(params)
}
// 删除确认
const handleDelete = async (row: any) => {
  // 加上 try...catch 结构
  try {
    // 1. 询问用户 (如果点取消，会直接跳到 catch，不会往下执行)
    await ElMessageBox.confirm(`是否确认删除用户 "${row.username}"?`, '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })

    // --- 只有点了确定，才会走到这里 ---

    // 2. 调用接口
    await deleteUser({ id: row.id })

    // 3. 提示 & 刷新
    ElMessage.success('删除成功！')
    proTableRef.value?.getTableList()
  } catch (error) {
    // --- 如果点了取消，会走到这里 ---
    console.log('用户取消了操作', error)
  }
}
</script>

<style scoped>
.table-content {
  height: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
