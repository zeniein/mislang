import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    theme: localStorage.getItem('theme') || 'light'
  }),

  actions: {
    setTheme(newTheme: string) {
      this.theme = newTheme
      localStorage.setItem('theme', newTheme)
      document.documentElement.setAttribute('data-theme', newTheme)
    },

    initTheme() {
      document.documentElement.setAttribute('data-theme', this.theme)
    }
  }
})
