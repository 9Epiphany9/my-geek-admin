**Current Progress (Stage 1-9 MVP):**

- **Infrastructure**: Vite + Vue3 + TS + Pinia + Element Plus 环境搭建完成。
- **Auth**: 完成登录全流程（Axios 拦截器、Token 持久化、Mock 登录接口）。
- **Layout**: 实现经典纵向布局，包含递归动态菜单、面包屑导航、Header 用户信息。
- **State Management**:
  - 使用 Pinia 实现侧边栏折叠交互。
  - 使用 Pinia + KeepAlive 实现 Tabs 标签页及页面缓存功能。
- **Core Component (ProTable MVP)**:
  - 封装 `useTable` Hook 处理分页、Loading 和数据请求逻辑。
  - 封装 `ProTable` 组件实现配置化表格渲染。
  - 解决 reactive 响应式丢失问题，实现作用域插槽透传。
