<template>
  <el-drawer v-model="drawerVisible" title="权限配置" size="400px">
    <el-form label-width="80px">
      <el-form-item label="角色名称">
        <el-input v-model="drawerProps.roleName" disabled></el-input>
      </el-form-item>

      <el-form-item label="菜单权限">
        <el-tree
          ref="treeRef"
          :data="menuData"
          :props="defaultProps"
          node-key="id"
          show-checkbox
          default-expand-all
        />
      </el-form-item>
    </el-form>

    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button type="primary" @click="handleSubmit">确定</el-button>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage, ElTree } from 'element-plus'
import { getMenuList, getRoleMenu } from '@/api/modules/role'

const drawerVisible = ref(false)
const drawerProps = ref<any>({})
const menuData = ref([]) // 树形菜单数据
const treeRef = ref<InstanceType<typeof ElTree>>()

// Tree 组件的配置项，告诉它哪个字段是名字，哪个是子级
const defaultProps = {
  children: 'children',
  label: 'title',
}

const acceptParams = async (row: any) => {
  drawerProps.value = row
  drawerVisible.value = true

  // 1. 获取所有菜单 (实际开发中这个可以在 mounted 里只请求一次，为了演示写在这里)
  const { data: allMenus } = await getMenuList()
  menuData.value = allMenus

  // 2. 获取当前角色已有的权限
  const { data: roleMenus } = await getRoleMenu({ roleId: row.id })

  // 3. 回显勾选状态
  // 必须用 nextTick，等待 Tree 渲染完毕
  nextTick(() => {
    // 第二个参数 false 表示不包含父子联动逻辑（避免父节点勾选导致子节点全勾）
    treeRef.value?.setCheckedKeys(roleMenus, false)
  })
}

const handleSubmit = () => {
  // 1. 获取全选的节点 ID
  const checkedKeys = treeRef.value?.getCheckedKeys()
  // 2. 获取半选的节点 ID (父节点) -> 这一点非常重要！
  // 比如你勾选了“用户管理”，它的父级“系统管理”通常也需要传给后端，否则侧边栏展不开
  const halfCheckedKeys = treeRef.value?.getHalfCheckedKeys()

  // 合并所有 ID
  const finalIds = [...checkedKeys!, ...halfCheckedKeys!]

  console.log('【提交】发送给后端的菜单ID:', finalIds)

  // 模拟调用保存接口
  setTimeout(() => {
    ElMessage.success('权限分配成功！')
    drawerVisible.value = false
  }, 500)
}

defineExpose({ acceptParams })
</script>
