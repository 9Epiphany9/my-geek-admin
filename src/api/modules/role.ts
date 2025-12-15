// 模拟角色列表
const roleList = [
  { id: '1', roleName: '超级管理员', status: 1, remark: '拥有最高权限' },
  { id: '2', roleName: '普通用户', status: 1, remark: '只能查看，不能修改' },
  { id: '3', roleName: '游客', status: 0, remark: '只能看首页' },
]

export const getRoleList = (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          list: roleList,
          total: roleList.length,
        },
      })
    }, 500)
  })
}

// 1. 获取所有菜单列表 (用于渲染 Tree)
// 注意：必须要有 id 和 children 结构
export const getMenuList = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: [
          {
            id: '1',
            title: '首页',
            children: [],
          },
          {
            id: '2',
            title: '系统管理',
            children: [
              { id: '2-1', title: '用户管理' },
              { id: '2-2', title: '角色管理' },
              { id: '2-3', title: '菜单管理' }, // 假装还有一个
            ],
          },
          {
            id: '3',
            title: '数据大屏',
            children: [],
          },
        ],
      })
    }, 300)
  })
}

// 2. 获取某个角色“当前拥有的权限” (用于回显打钩)
// 假设“普通用户(id=2)”只有“首页”和“用户管理”权限
export const getRoleMenu = (params: { roleId: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (params.roleId === '2') {
        resolve({ data: ['1', '2-1'] }) // 返回 ID 数组
      } else {
        resolve({ data: [] })
      }
    }, 300)
  })
}
