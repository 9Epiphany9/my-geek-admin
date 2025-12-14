<template>
  <div class="table-box">
    <div class="search-box" v-if="searchParam"></div>

    <div class="table-header">
      <div class="header-button-lf">
        <slot name="tableHeader"></slot>
      </div>
      <div class="header-button-ri">
        <el-button icon="Refresh" circle @click="getTableList" />
      </div>
    </div>

    <el-table v-loading="loading" :data="tableData" border>
      <template v-for="item in columns" :key="item.prop">
        <el-table-column
          v-if="item.type == 'selection' || item.type == 'index'"
          :type="item.type"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
        />

        <el-table-column
          v-else
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :fixed="item.fixed"
        >
          <template #default="scope">
            <slot :name="item.prop" :row="scope.row">
              {{ scope.row[item.prop!] }}
            </slot>
          </template>
        </el-table-column>
      </template>
    </el-table>

    <el-pagination
      class="table-pagination"
      :current-page="pageable.pageNum"
      :page-size="pageable.pageSize"
      :page-sizes="[10, 25, 50, 100]"
      :background="true"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pageable.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useTable } from '@/hooks/useTable'

// 定义 props
interface ProTableProps {
  columns: any[] // 列配置
  requestApi: (params: any) => Promise<any> // 请求接口
  initParam?: any // 初始化参数
}

const props = defineProps<ProTableProps>()

// 使用 Hook
const {
  tableData,
  pageable,
  loading,
  searchParam,
  getTableList,
  handleSizeChange,
  handleCurrentChange,
} = useTable(props.requestApi, props.initParam)

// 挂载时请求数据
onMounted(() => {
  getTableList()
})

// 暴露给父组件，父组件可能需要手动刷新表格
defineExpose({ getTableList })
</script>

<style scoped>
.table-box {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.table-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}
.table-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
