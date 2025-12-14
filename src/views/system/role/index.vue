<!-- eslint-disable vue/no-unused-vars -->
<script setup lang="ts">
import ProTable from '@/components/ProTable/index.vue'
import { getRoleList } from '@/api/modules/role'

defineOptions({ name: 'Role' })

// 表格配置 (以后写页面主要就是写这个数组)
const columns = [
  { type: 'index', label: '#', width: 80 },
  { prop: 'roleName', label: '角色名称' },
  { prop: 'desc', label: '角色描述' },
  // 重点：遇到需要自定义样式的列（比如操作栏），起个名字（slot name）
  { prop: 'operation', label: '操作', width: 200 },
]
</script>

<template>
  <div class="table-content">
    <ProTable ref="proTableRef" :columns="columns" :requestApi="getRoleList">
      <template #tableHeader>
        <el-button type="primary" icon="CirclePlus">新增身份</el-button>
      </template>

      <template #status="scope">
        <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
          {{ scope.row.status === 1 ? '启用' : '禁用' }}
        </el-tag>
      </template>

      <template #operation="scope">
        <el-button type="primary" link>编辑</el-button>
        <el-button type="danger" link>删除</el-button>
        <el-button link @click="console.log(scope.row)">查看详情</el-button>
      </template>
    </ProTable>
  </div>
</template>

<style>
.table-content {
  height: 100%;
  background: #fff;
  padding: 20px;
  box-sizing: border-box;
}
</style>
