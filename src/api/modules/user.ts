// // 定义一个大一点的本地数据源 (模拟数据库)
const userList = [
  { id: 1, username: 'Geeker', gender: 1, age: 18, email: 'geek@163.com', status: 1 },
  { id: 2, username: 'Spicy', gender: 2, age: 22, email: 'spicy@qq.com', status: 0 },
  { id: 3, username: 'Admin', gender: 1, age: 30, email: 'admin@qq.com', status: 1 },
  { id: 4, username: 'User001', gender: 2, age: 25, email: 'u001@qq.com', status: 0 },
  { id: 5, username: 'TestMan', gender: 1, age: 28, email: 'test@qq.com', status: 1 },
  { id: 6, username: 'Halsey', gender: 2, age: 21, email: 'halsey@qq.com', status: 1 },
  { id: 7, username: 'Evan', gender: 1, age: 24, email: 'evan@qq.com', status: 0 },
  { id: 8, username: 'Larry', gender: 1, age: 26, email: 'larry@qq.com', status: 1 },
  { id: 9, username: 'David', gender: 1, age: 19, email: 'david@qq.com', status: 0 },
  { id: 10, username: 'Jack', gender: 1, age: 35, email: 'jack@qq.com', status: 1 },
  { id: 11, username: 'Tom', gender: 1, age: 40, email: 'tom@qq.com', status: 0 },
  { id: 12, username: 'Jerry', gender: 1, age: 12, email: 'jerry@qq.com', status: 1 },
]

// 模拟接口
export const getUserList = (params: any) => {
  return new Promise((resolve) => {
    // 模拟网络延迟，更有感觉
    setTimeout(() => {
      console.log('---------------')
      console.log('【Mock后端】收到请求参数:', params)

      // --- 1. 模拟数据库查询逻辑 (Filter) ---
      let result = userList

      // 如果传了 username，就模糊查询
      if (params.username) {
        result = result.filter((item) =>
          item.username.toLowerCase().includes(params.username.toLowerCase()),
        )
      }

      // 如果传了 status (注意 0 也是有效值，所以要判断是否 undefined)
      // params.status 可能是数字也可能是字符串，这里做个兼容
      if (params.status !== undefined && params.status !== '') {
        const queryStatus = Number(params.status)
        result = result.filter((item) => item.status === queryStatus)
      }

      // --- 2. 模拟分页逻辑 (Pagination) ---
      const pageNum = params.pageNum || 1
      const pageSize = params.pageSize || 10

      const total = result.length // 总条数
      // 计算起始位置：(页码-1) * 每页数量
      const start = (pageNum - 1) * pageSize
      // 计算结束位置
      const end = start + pageSize
      // 截取当前页的数据
      const pageData = result.slice(start, end)

      console.log(`【Mock后端】筛选后剩余 ${total} 条，当前返回第 ${pageNum} 页`)

      // --- 3. 返回结果 ---
      resolve({
        data: {
          list: pageData,
          total: total,
        },
      })
    }, 500) // 0.5秒延迟
  })
}
