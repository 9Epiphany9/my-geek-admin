import axios from 'axios'

interface BaseResponse<T = undefined> {
  code: number
  data: T
  msg?: string
}

interface user {
  userId: number
  nickname: string
  avatar: string
}

interface requestBody {
  username: string
  password: string
}

interface RespponseBody {
  token: string
  userInfo: user
}

export const login = (data: requestBody) => {
  return axios<BaseResponse<RespponseBody>>({
    method: 'post',
    url: '/api/login',
    data,
  })
}
