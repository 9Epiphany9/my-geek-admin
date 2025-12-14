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
</script>

<style scoped>
.table-content {
  height: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
