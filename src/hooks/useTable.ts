import { reactive, computed, toRefs } from 'vue'

export interface TableStateProps {
  tableData: any[]
  pageable: {
    pageNum: number
    pageSize: number
    total: number
  }
  loading: boolean
  searchParam: { [key: string]: any }
  totalParam: { [key: string]: any }
  icon?: { [key: string]: any }
}

export const useTable = (
  api?: (params: any) => Promise<any>,
  initParam: object = {},
  isPageable: boolean = true,
) => {
  const state = reactive<TableStateProps>({
    // 表格数据
    tableData: [],
    // 分页数据
    pageable: {
      pageNum: 1,
      pageSize: 10,
      total: 0,
    },
    // Loading 状态
    loading: false,
    // 查询参数(只包含查询表单)
    searchParam: {},
    // 总参数(包含分页和查询表单)
    totalParam: {},
  })

  // 分页参数 (发送给后端的)
  const pageParam = computed({
    get: () => {
      return {
        pageNum: state.pageable.pageNum,
        pageSize: state.pageable.pageSize,
      }
    },
    set: (newVal: any) => {
      console.log('我是分页更新', newVal)
    },
  })

  // 获取表格数据 (核心逻辑)
  const getTableList = async () => {
    if (!api) return
    try {
      state.loading = true
      Object.assign(state.totalParam, initParam, isPageable ? pageParam.value : {})

      // 1. 先把请求结果完整打印出来，看看长什么样
      const res = await api({ ...state.searchParam, ...state.totalParam })
      console.log('【调试】API返回的完整数据：', res)

      // --- 你的问题大概率出在下面这一行 ---
      // 以前的代码写的是： const { data } = await api(...)
      // 如果你的 res 本身就是数据列表（没有包一层 data），那这里解构就会变成 undefined

      // 2. 根据控制台打印的结构，来决定怎么赋值
      // 假设 res 是 { data: { list: [], total: 10 } } (Mock Promise 的情况)
      // 或者是 { list: [], total: 10 } (经过 Axios 拦截器脱壳后的情况)

      // 为了兼容，我们先改写成这样试试：
      let data = res
      if (res && res.data) {
        data = res.data // 如果多包了一层 data，就剥开
      }

      console.log('【调试】提取出的核心数据：', data)

      // 3. 赋值
      state.tableData = isPageable ? data.list : data
      const { total } = data
      state.pageable.total = isPageable ? total : 0
    } catch (error) {
      console.error(error)
    } finally {
      state.loading = false
    }
  }

  // 更新查询参数
  const updatedTotalParam = () => {
    state.totalParam = {}
    // 处理查询参数，可以加上一些特殊处理逻辑
    const nowSearchParam: { [key: string]: any } = {}
    // 防止为空字符串的情况
    for (const key in state.searchParam) {
      if (
        state.searchParam[key] ||
        state.searchParam[key] === false ||
        state.searchParam[key] === 0
      ) {
        nowSearchParam[key] = state.searchParam[key]
      }
    }
    Object.assign(state.totalParam, nowSearchParam, isPageable ? pageParam.value : {})
  }

  // 表格查询
  const search = () => {
    state.pageable.pageNum = 1
    updatedTotalParam()
    getTableList()
  }

  // 表格重置
  const reset = () => {
    state.pageable.pageNum = 1
    state.searchParam = {}
    updatedTotalParam()
    getTableList()
  }

  // 每页条数改变
  const handleSizeChange = (val: number) => {
    state.pageable.pageNum = 1
    state.pageable.pageSize = val
    getTableList()
  }

  // 当前页改变
  const handleCurrentChange = (val: number) => {
    state.pageable.pageNum = val
    getTableList()
  }

  return {
    ...toRefs(state), // <--- 关键修改在这里！
    getTableList,
    search,
    reset,
    handleSizeChange,
    handleCurrentChange,
  }
}
