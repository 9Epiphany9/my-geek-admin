import resquest from '@/api/index'

export interface LoginParams {
  username: string
  password: string
}

export const loginApi = (params: LoginParams) => {
  return resquest({
    url: 'login',
    method: 'POST',
    data: params,
  })
}
