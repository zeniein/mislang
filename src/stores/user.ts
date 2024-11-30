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

// 从 localStorage 获取初始状态
const getInitialState = (): UserState => {
  const savedState = localStorage.getItem('userState')
  if (savedState) {
    return JSON.parse(savedState)
  }
  return {
    isLoggedIn: false,
    userInfo: null,
    displayName: 'Guest'
  }
}

export const useUserStore = defineStore('user', {
  state: (): UserState => getInitialState(),

  getters: {
    userDisplayName: state => state.displayName,
    isAuthenticated: state => state.isLoggedIn
  },

  actions: {
    // 保存状态到 localStorage
    saveState() {
      localStorage.setItem('userState', JSON.stringify({
        isLoggedIn: this.isLoggedIn,
        userInfo: this.userInfo,
        displayName: this.displayName
      }))
    },

    async login(form: LoginForm) {
      // 模拟登录，实际项目中需要调用后端 API
      if (form.username === 'admin' && form.password === 'admin') {
        this.isLoggedIn = true
        this.userInfo = {
          username: form.username,
          name: '管理员'
        }
        this.displayName = this.userInfo.name
        // 登录成功后保存状态
        this.saveState()
      } else {
        throw new Error('用户名或密码错误')
      }
    },

    logout() {
      this.isLoggedIn = false
      this.userInfo = null
      this.displayName = 'Guest'
      // 登出时清除保存的状态
      localStorage.removeItem('userState')
    },

    // 检查登录状态
    checkAuth() {
      const savedState = localStorage.getItem('userState')
      if (savedState) {
        const state = JSON.parse(savedState)
        this.isLoggedIn = state.isLoggedIn
        this.userInfo = state.userInfo
        this.displayName = state.displayName
        return true
      }
      return false
    }
  }
})
