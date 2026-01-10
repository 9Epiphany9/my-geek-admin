# 学习复盘文档

本篇复盘涵盖近期所有关键改动：Mock 接入、Axios 基础设施、登录流程修复、用户管理的表格/抽屉交互修复，以及响应式与展示问题。按模块梳理，便于学习与查阅。

---

## 1. 本地 Mock 体系

- 位置：src/mock/auth.ts、src/mock/user.ts、src/mock/role.ts
- 做了什么：
  - 增加登录与刷新 Token 端点，返回 `{ code: 200, data: { token } }`，并简单校验用户名/密码。
  - 用户端点：列表、增/改/删、状态修改、改密码；支持搜索+分页。
  - 角色端点：角色列表、菜单树、角色菜单读/写。
- 目的：在无真实后端时，仍可用 Axios 全链路调试（拦截器、生存期管理、错误处理）。

## 2. Axios 基础设施

- 位置：src/api/request.ts（核心）、src/api/index.ts（导出）。
- 核心能力：
  - 统一响应模型 `ApiResponse<T>`，拦截器自动“脱壳”返回 `data`。
  - 自动重试 + 指数退避（默认重试 2 次，500ms 起步，幂等场景可提高）。
  - Token 过期自动刷新：并发队列确保只刷新一次，其他请求等待后复用新 token。
  - 错误分类提示：业务错误提示后端 msg，401 提示过期，网络错误提示检查网络。
- 学习要点：
  - 并发控制（刷新队列）是高频面试/实战题。
  - 通过扩展配置（`retry`、`retryDelay`）实现可控的容错策略。
  - 将所有 API 模块改为使用命名导出 `{ service }`，避免默认导出混用。

## 3. API 模块改造

- 位置：
  - 登录：src/api/modules/login.ts
  - 用户：src/api/modules/user.ts
  - 角色：src/api/modules/role.ts
  - 权限：src/api/modules/auth.ts
- 做了什么：
  - 全部改为调用 `service`（Axios 实例），享受拦截器的统一行为。
  - 类型补全：`User`、`Paginated<T>`、`LoginResponse` 等，减少 `any`。
  - 登录接口路径改为 `/auth/login`，返回结构与 Mock 对齐（token）。

## 4. 登录流程修复

- 位置：src/views/login/components/LoginForm.vue
- 原因：Mock 返回 `{ token }`，拦截器已脱壳，但组件取 `res.access_token`，导致存了 `undefined`，路由守卫失效。
- 修复：直接使用 `res.token`，并在 console 打印调试信息。
- 效果：登录后正确持久化 `geeker-token`，路由守卫和权限加载恢复正常。

## 5. 用户管理：表格与抽屉

- 位置：
  - 表格页：src/views/system/user/index.vue
  - 抽屉：src/views/system/user/UserDrawer.vue
  - 表格 Hook：src/hooks/useTable.ts
- 问题与修复：
  1. 性别列显示错误
     - 原因：模板误用 `status` 字段判断性别。
     - 修复：使用 `scope.row.gender`，显示“♂ 男 / ♀ 女”。
  2. 编辑后页面不刷新
     - 原因：可能的响应式滞后；编辑后虽调用刷新，但数组引用未变化可能导致视图不更新。
     - 修复：`useTable` 在赋值时使用新数组引用 `state.tableData = [...data.list]` 强制触发更新。
  3. 提交流程
     - 抽屉内统一从父组件注入 `api`（新增/编辑），提交后调用 `getTableList` 刷新。

## 6. 目录与文件索引（便于回看）

- Mock 端点：
  - src/mock/auth.ts
  - src/mock/user.ts
  - src/mock/role.ts
- Axios 核心：
  - src/api/request.ts
  - src/api/index.ts
- 业务 API：
  - src/api/modules/login.ts
  - src/api/modules/user.ts
  - src/api/modules/role.ts
  - src/api/modules/auth.ts
- 页面与组件：
  - 登录：src/views/login/components/LoginForm.vue
  - 用户列表：src/views/system/user/index.vue
  - 用户抽屉：src/views/system/user/UserDrawer.vue
  - 通用表格 Hook：src/hooks/useTable.ts
  - ProTable：src/components/ProTable/index.vue

## 7. 自测清单

- 登录
  - 任意账号/密码点击登录 → 应跳转首页，localStorage 出现 geeker-token。
- 用户列表
  - 编辑性别后列表应立即显示正确性别。
  - 列表刷新按钮、分页、搜索应正常（观察 Network 响应）。
- Token 刷新
  - 将 localStorage 的 geeker-token 改成无效值后触发请求 → 看到 401 → 自动请求 /auth/refresh-token → 原请求重放成功。
- 重试逻辑
  - 可临时把某接口改成返回 500，观察最多重试 2 次后给出错误提示。

## 8. 面试/学习要点速记

- 并发控制：Token 刷新队列，避免多次刷新。
- 容错策略：自动重试 + 指数退避，幂等请求可安全重试。
- 类型安全：定义响应与实体类型，减少 `any`，让 IDE 辅助。
- 视图更新：数组/对象更新尽量用新引用，避免响应式滞后。
- Mock 策略：保持与真实后端同构的返回结构，方便无缝切换。

## 9. 进阶可做

- 为 useTable 增加泛型参数，列定义与插槽获得更严格类型提示。
- 在拦截器里加入请求去重/取消（例如搜索防抖）。
- 为表单与接口增加更完善的校验与错误提示。

---

> 如果想深入某一段代码，可直接跳转上述路径查看实现。建议结合 Network 面板与控制台日志，一起观察请求、重试、刷新 Token 的全过程。
