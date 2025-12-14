// 模拟用户列表接口
export const getUserList = (params: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('【ProTable】请求参数：', params)
      resolve({
        data: {
          list: [
            { id: 1, username: 'Geeker', gender: 1, age: 18, email: 'geek@163.com', status: 1 },
            { id: 2, username: 'Spicy', gender: 2, age: 22, email: 'spicy@qq.com', status: 0 },
            // 你可以多复制几行，凑够10条以上，测试分页
          ],
          total: 100, // 假装有100条
        },
      })
    }, 500)
  })
}
