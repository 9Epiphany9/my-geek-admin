<template>
  <div class="search-form" v-if="columns.length">
    <el-form :model="searchParam" inline>
      <template v-for="item in columns" :key="item.prop">
        <el-form-item v-if="item.search" :label="item.label">
          <el-input
            v-if="item.search.el === 'input'"
            v-model="searchParam[item.prop]"
            placeholder="请输入"
            clearable
          />

          <el-select
            v-if="item.search.el === 'select'"
            v-model="searchParam[item.prop]"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="opt in item.enum"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </template>

      <el-form-item>
        <el-button type="primary" icon="Search" @click="search">搜索</el-button>
        <el-button icon="Delete" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
// 接收父组件传来的配置
interface SearchFormProps {
  columns: any[] // 列配置
  searchParam: any // 搜索参数 (双向绑定)
  search: (params: any) => void // 搜索方法
  reset: (params: any) => void // 重置方法
}

defineProps<SearchFormProps>()
</script>

<style scoped>
.search-form {
  background-color: #fff;
  padding: 18px 18px 0 18px;
  margin-bottom: 10px;
  border-radius: 4px; /* 稍微给点圆角 */
}
</style>
