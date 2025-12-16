// 引入所有 views 下的 .vue 文件
// modules 变成了一个对象：{ "/src/views/home/index.vue": () => import(...) }
const modules = import.meta.glob('@/views/**/*.vue')

/**
 * @description 初始化动态路由
 * @param router 路由实例
 * @param authStore authStore 实例
 */
export const initDynamicRouter = async (router: any, authStore: any) => {
  try {
    // 1. 获取菜单列表 (如果 Store 里没有，就发请求)
    await authStore.getAuthMenuList()

    // 2. 扁平化菜单 (把嵌套的 children 全拍平，方便添加路由)
    // 为什么拍平？因为 addRoute 建议把所有子路由都添加到 layout 下，
    // 或者直接注册为顶级路由（取决于你的架构），GeekerAdmin 通常是拍平后加到 layout 内部
    // 这里我们先简化，假设你需要自己写一个 flatMenuList 函数，或者我们直接遍历

    // 注意：真实项目中，这里通常会处理数据，把 component 字符串替换成真实组件
    // 我们定义一个递归函数来添加路由

    authStore.authMenuList.forEach((item: any) => {
      // 如果是根菜单（如首页），或者有 children 的
      // 这里为了简化演示，我们只处理两层结构，或者写个递归
      addDynamicRoute(item, router)
    })
  } catch (error) {
    console.error('加载动态路由失败', error)
    // 出错了，重置 token 并跳回登录
    localStorage.removeItem('geeker-token')
    router.replace('/login')
    return Promise.reject(error)
  }
}

// 递归处理并添加路由
const addDynamicRoute = (menu: any, router: any) => {
  if (menu.children && menu.children.length) {
    menu.children.forEach((child: any) => addDynamicRoute(child, router))
  }

  if (menu.component && typeof menu.component === 'string') {
    // 核心：把 component: "/home/index" 变成真实的 import
    const componentString = menu.component

    // 这一步非常关键！路径必须拼对
    const rowComponent = modules[`/src/views${componentString}.vue`]

    if (rowComponent) {
      // 这里的 'Layout' 是你在 router/index.ts 里定义的那个 layout 路由的 name
      // 我们把所有业务页面都作为 Layout 的子路由添加进去
      router.addRoute('Layout', {
        path: menu.path,
        name: menu.name,
        component: rowComponent,
        meta: menu.meta,
      })
      // console.log("添加路由成功：", menu.path);
    } else {
      console.warn(`找不到组件：/src/views${componentString}.vue`)
    }
  }
}
