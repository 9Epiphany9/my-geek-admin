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
import { getMenuList, getRoleMenu, saveRoleMenu } from '@/api/modules/role'

const drawerVisible = ref(false)
const drawerProps = ref<any>({})
const menuData = ref<any[]>([]) // 树形菜单数据
const treeRef = ref<InstanceType<typeof ElTree>>()

// Tree 组件的配置项，告诉它哪个字段是名字，哪个是子级
const defaultProps = {
  children: 'children',
  label: 'title',
}

const acceptParams = async (row: any) => {
  drawerProps.value = row
  drawerVisible.value = true

  // 1. 获取所有菜单（拦截器已脱壳，直接就是菜单数组）
  const allMenus = (await getMenuList()) as unknown as any[]
  menuData.value = allMenus || []

  // 2. 获取当前角色已有的权限（同样已脱壳，直接是 ID 数组）
  const roleMenus = (await getRoleMenu({ roleId: row.id })) as unknown as string[]

  // 3. 回显勾选状态
  nextTick(() => {
    treeRef.value?.setCheckedKeys(roleMenus || [], false)
  })
}

const handleSubmit = async () => {
  // 1. 获取全选与半选节点
  const checkedKeys = (treeRef.value?.getCheckedKeys?.() as string[] | undefined) || []
  const halfCheckedKeys = (treeRef.value?.getHalfCheckedKeys?.() as string[] | undefined) || []

  // 2. 合并 ID，并去重
  const finalIds = Array.from(new Set([...checkedKeys, ...halfCheckedKeys]))

  // 3. 调用保存接口
  await saveRoleMenu({ roleId: drawerProps.value.id, menuIds: finalIds })

  ElMessage.success('权限分配成功！')
  drawerVisible.value = false
}

defineExpose({ acceptParams })
</script>
