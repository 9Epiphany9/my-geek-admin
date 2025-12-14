// src/api/modules/role.ts
//import http from "@/api"; // 假设你封装好了 axios

// 1. 定义接口
export const getRoleList = (params: any) => {
  // 真实开发就写这一行：
  // return http.post("/role/list", params);

  // 还没后端？那就复制粘贴下面这段 Mock 代码：
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: {
          list: [
            { id: 1, roleName: '超级管理员', desc: '拥有所有权限' },
            { id: 2, roleName: '普通用户', desc: '只能看，不能改' },
          ],
          total: 2,
        },
      })
    }, 500)
  })
}
