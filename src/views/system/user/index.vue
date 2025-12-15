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
        <el-switch
          v-model="scope.row.status"
          :active-value="1"
          :inactive-value="0"
          active-text="启用"
          inactive-text="禁用"
          inline-prompt
          :before-change="() => switchStatus(scope.row)"
          :loading="scope.row.loading"
        />
      </template>

      <template #avatar="scope">
        <el-image
          style="width: 50px; height: 50px; border-radius: 50%"
          :src="scope.row.avatar"
          :preview-src-list="[scope.row.avatar]"
          preview-teleported
          fit="cover"
        >
          <template #error>
            <div class="image-slot">
              <el-icon><Picture /></el-icon>
            </div>
          </template>
        </el-image>
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
import { getUserList, deleteUser, addUser, editUser, changeUserStatus } from '@/api/modules/user'
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
  { prop: 'avatar', label: '头像', width: 80 },
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
// 切换用户状态
const switchStatus = (row: any) => {
  // 1. 立即开启 Loading 动画
  // (注意：Mock 数据里没有 loading 字段，Vue3 会自动把它变成响应式的，直接用就行)
  row.loading = true

  // 计算目标值（现在的反面）
  const newStatus = row.status === 1 ? 0 : 1

  // 2. 返回一个 Promise，这是 before-change 要求的
  return new Promise<boolean>(async (resolve, reject) => {
    try {
      // 3. 调用 API
      await changeUserStatus({ id: row.id, status: newStatus })

      ElMessage.success('状态修改成功')

      // 4. 【关键一步】虽然返回 true 会让 switch 自动变，
      // 但为了保险，我们手动把 row.status 改过来，防止 Vue 响应式滞后
      // (这一步其实是双保险)
      // row.status = newStatus; // 可选，Element Plus 通常会自己处理

      resolve(true) // 告诉 Switch：可以切换了
    } catch (error) {
      // 失败了，告诉 Switch：别动
      reject()
    } finally {
      // 5. 无论成功失败，关闭 Loading
      // 加个小延迟，让动画稍微展示一下，避免闪烁太快
      setTimeout(() => {
        row.loading = false
      }, 300)
    }
  })
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
