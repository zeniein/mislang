import { defineStore } from 'pinia'

interface User {
  id: string
  username: string
  email: string
  token: string
}

interface AuthState {
  user: User | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => {
    const savedUser = localStorage.getItem('user')
    const savedToken = localStorage.getItem('token')
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken
    }
  },

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    setUser(user: User) {
      this.user = user
      this.token = user.token
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('token', user.token)
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    },

    // 检查并恢复认证状态
    checkAuth() {
      const savedUser = localStorage.getItem('user')
      const savedToken = localStorage.getItem('token')
      if (savedUser && savedToken) {
        this.user = JSON.parse(savedUser)
        this.token = savedToken
        return true
      }
      return false
    }
  }
})
