/***
 * @name 模拟文件上传接口
 * @description 纯前端实现,将文件转为Base64返回,假装是服务器返回的url
 */
export const uploadImg = (params: FormData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const file = params.get('file') as File
      // 文件读取器
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resolve({
          code: 200,
          data: {
            fileUrl: reader.result,
          },
          mes: '上传成功',
        })
      }
    }, 500)
  })
}
