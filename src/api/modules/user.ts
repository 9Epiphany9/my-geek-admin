//import { User } from "@/api/interface"; // 如果没有定义类型，可以用 any，但建议慢慢规范

// 1. 定义一个“内存数据库” (注意：这里用 let，因为我们要修改它)
let userList = [
  { id: '1', username: 'Geeker', gender: 1, age: 18, email: 'geek@163.com', status: 1 },
  { id: '2', username: 'Spicy', gender: 2, age: 22, email: 'spicy@qq.com', status: 0 },
  { id: '3', username: 'Admin', gender: 1, age: 30, email: 'admin@qq.com', status: 1 },
  { id: '4', username: 'User001', gender: 2, age: 25, email: 'u001@qq.com', status: 0 },
]

// 生成随机ID的辅助函数
const generateId = () => Math.floor(Math.random() * 100000).toString()

// --- 接口定义 ---

/**
 * @name 获取用户列表 (查)
 * 支持分页、搜索
 */
export const getUserList = (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 1. 先筛选 (Search)
      let result = userList
      if (params.username) {
        result = result.filter((item) =>
          item.username.toLowerCase().includes(params.username.toLowerCase()),
        )
      }
      if (params.status !== undefined && params.status !== '') {
        result = result.filter((item) => item.status === Number(params.status))
      }

      // 2. 再分页 (Pagination)
      const pageNum = params.pageNum || 1
      const pageSize = params.pageSize || 10
      const total = result.length
      const pageData = result.slice((pageNum - 1) * pageSize, pageNum * pageSize)

      resolve({
        data: {
          list: pageData,
          total: total,
        },
      })
    }, 300)
  })
}

/**
 * @name 新增用户 (增)
 */
export const addUser = (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newUser = {
        id: generateId(),
        ...params,
        status: params.status || 1, // 默认启用
      }
      // 真的往数组里加数据！
      userList.unshift(newUser)
      console.log('【Mock】新增成功，当前总数:', userList.length)
      resolve({ code: 200, msg: '新增成功' })
    }, 500)
  })
}

/**
 * @name 编辑用户 (改)
 */
export const editUser = (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 找到要改的那个人，替换属性
      const index = userList.findIndex((item) => item.id === params.id)
      if (index !== -1) {
        userList[index] = { ...userList[index], ...params }
      }
      console.log('【Mock】编辑成功:', userList[index])
      resolve({ code: 200, msg: '编辑成功' })
    }, 500)
  })
}

/**
 * @name 删除用户 (删)
 */
export const deleteUser = (params: { id: string }) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 真的从数组里剔除！
      userList = userList.filter((item) => item.id !== params.id)
      console.log('【Mock】删除成功，剩余总数:', userList.length)
      resolve({ code: 200, msg: '删除成功' })
    }, 500)
  })
}
