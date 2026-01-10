/**
 * 统一导出 axios 实例
 * 核心功能：
 * - 自动附加 Token
 * - 响应脱壳（{ code, data } -> data）
 * - 请求自动重试（指数退避）
 * - Token 过期自动刷新 + 队列等待
 * - 错误分类与统一提示
 */
export { service, createService } from './request'
export type { ApiResponse } from './request'
