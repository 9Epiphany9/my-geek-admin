import * as XLSX from 'xlsx'

/**
 * @description 导出 Excel
 * @param data 要导出的数据 (数组对象)
 * @param fileName 导出的文件名
 * @param bookType 导出的格式 (xlsx, csv, txt, etc.)
 */
export const jsonToExcel = (
  data: any[],
  fileName: string = 'export-data',
  bookType: XLSX.BookType = 'xlsx',
) => {
  // 1. 创建一个工作簿
  const wb = XLSX.utils.book_new()

  // 2. 将 JSON 数据转换为 Sheet
  // json_to_sheet 会自动把对象的 key 作为表头
  const ws = XLSX.utils.json_to_sheet(data)

  // 3. 将 Sheet 加到工作簿中
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')

  // 4. 写文件并触发下载
  XLSX.writeFile(wb, `${fileName}.${bookType}`)
}
