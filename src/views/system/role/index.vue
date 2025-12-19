<template>
  <div class="table-content">
    <ProTable :columns="columns" :requestApi="getRoleList">
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus">新增角色</el-button>
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
import ProTable from '@/components/ProTable/index.vue'
import { getRoleList } from '@/api/modules/role'
import RoleDrawer from './RoleDrawer.vue' // 👈 下一步创建

const drawerRef = ref()

const columns = [
  { type: 'index', label: '#', width: 80 },
  { prop: 'roleName', label: '角色名称', search: { el: 'input' } },
  { prop: 'status', label: '状态', width: 120 }, // 偷懒先不写 switch 了
  { prop: 'remark', label: '备注' },
  { prop: 'operation', label: '操作', fixed: 'right', width: 280 },
]

const openDrawer = (row: any) => {
  drawerRef.value?.acceptParams(row)
}
defineOptions({
  name: 'Role',
})
</script>
<style scoped>
.table-content {
  height: 100%;
  padding: 20px;
  background: #fff;
}
</style>
