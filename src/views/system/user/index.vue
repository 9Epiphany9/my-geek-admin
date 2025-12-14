<template>
  <div class="table-content">
    <ProTable ref="proTableRef" :columns="columns" :requestApi="getUserList">
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus">新增用户</el-button>
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
        <el-button type="primary" link icon="Edit">编辑</el-button>
        <el-button type="danger" link icon="Delete">删除</el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue'
import { getUserList } from '@/api/modules/user'

defineOptions({ name: 'User' })

// 表格配置 (以后写页面主要就是写这个数组)
const columns = [
  { type: 'selection', fixed: 'left', width: 80 },
  { type: 'index', label: '#', width: 80 },
  { prop: 'username', label: '用户姓名', width: 120 },
  { prop: 'gender', label: '性别', width: 100 },
  { prop: 'age', label: '年龄', width: 100 },
  { prop: 'email', label: '邮箱' },
  { prop: 'status', label: '用户状态', width: 120 }, // 这里会匹配到 slot name="status"
  { prop: 'operation', label: '操作', fixed: 'right', width: 180 }, // 这里匹配 slot name="operation"
]
</script>

<style scoped>
.table-content {
  height: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
