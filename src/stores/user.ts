import { defineStore } from 'pinia'

interface UserState {
  isLoggedIn: boolean
  userInfo: any
  displayName: string
}

interface LoginForm {
  username: string
  password: string
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    isLoggedIn: false,
    userInfo: null,
    displayName: 'Guest'
  }),

  getters: {
    userDisplayName: state => state.displayName
  },

  actions: {
    async login(form: LoginForm) {
      // 模拟登录，实际项目中需要调用后端 API
      if (form.username === 'admin' && form.password === 'admin') {
        this.isLoggedIn = true
        this.userInfo = {
          username: form.username,
          name: '管理员'
        }
        this.displayName = this.userInfo.name
      } else {
        throw new Error('用户名或密码错误')
      }
    },

    logout() {
      this.isLoggedIn = false
      this.userInfo = null
      this.displayName = 'Guest'
    }
  }
})
