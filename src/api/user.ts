import http from '@/utils/http'
import type { ResponseData } from '@/types/http'

interface LoginParams {
  email: string
  password: string
}

interface UserInfo {
  id: number
  name: string
  email: string
  avatar?: string
}

export class UserApi {
  // 用户登录
  static async login(params: LoginParams): Promise<ResponseData<{ token: string }>> {
    return http.post('/auth/login', params)
  }

  // 获取用户信息
  static async getUserInfo(): Promise<ResponseData<UserInfo>> {
    return http.get('/user/info')
  }

  // 更新用户信息
  static async updateUserInfo(data: Partial<UserInfo>): Promise<ResponseData<UserInfo>> {
    return http.put('/user/info', data)
  }

  // 修改密码
  static async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<ResponseData<void>> {
    return http.post('/user/change-password', {
      oldPassword,
      newPassword
    })
  }
}

export default UserApi
