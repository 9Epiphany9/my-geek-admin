<template>
  <div class="table-content">
    <ProTable ref="tableRef" :columns="columns" :requestApi="getRoleList">
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus">新增角色</el-button>
      </template>

      <template #status="{ row }">
        <el-switch
          :model-value="row.status === 1"
          inline-prompt
          active-text="启用"
          inactive-text="禁用"
          :loading="row._statusLoading"
          @change="(val: boolean) => handleStatusChange(row, val)"
        />
      </template>

      <template #operation="scope">
        <el-button type="primary" link icon="User" @click="openDrawer(scope.row)"
          >菜单权限</el-button
        >
        <el-button type="primary" link icon="Edit">编辑</el-button>
        <el-button type="danger" link icon="Delete">删除</el-button>
      </template>
    </ProTable>

    <RoleDrawer ref="drawerRef" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import ProTable from '@/components/ProTable/index.vue'
import RoleDrawer from './RoleDrawer.vue'
import { getRoleList, updateRoleStatus, type RoleItem } from '@/api/modules/role'

const tableRef = ref<InstanceType<typeof ProTable>>()
const drawerRef = ref<InstanceType<typeof RoleDrawer>>()

const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 },
]

const columns = [
  { type: 'index', label: '#', width: 80 },
  { prop: 'roleName', label: '角色名称', search: { el: 'input' } },
  { prop: 'status', label: '状态', width: 150, search: { el: 'select' }, enum: statusOptions },
  { prop: 'remark', label: '备注' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 },
]

const handleStatusChange = async (
  row: RoleItem & { _statusLoading?: boolean },
  checked: boolean,
) => {
  const previous = row.status
  row.status = checked ? 1 : 0
  row._statusLoading = true
  try {
    await updateRoleStatus({ id: row.id, status: row.status })
    ElMessage.success('状态已更新')
    tableRef.value?.getTableList?.()
  } catch {
    row.status = previous
    ElMessage.error('状态更新失败，请重试')
  } finally {
    row._statusLoading = false
  }
}

const openDrawer = (row: RoleItem) => {
  drawerRef.value?.acceptParams(row)
}
defineOptions({
  name: 'RolePage',
})
</script>
<style scoped>
.table-content {
  height: 100%;
  padding: 20px;
  background: var(--el-bg-color-overlay);
}
</style>
