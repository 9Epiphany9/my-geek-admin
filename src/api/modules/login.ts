import { service } from '@/api/index'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResponse {
  token: string
}

export const loginApi = (data: LoginParams) => service.post<LoginResponse>('/auth/login', data)
