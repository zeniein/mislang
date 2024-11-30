import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
    name: 'Counter'
  }),

  getters: {
    doubleCount: state => state.count * 2,
    // 带参数的 getter
    doubleCountPlus: state => {
      return (amount: number) => state.count * 2 + amount
    }
  },

  actions: {
    increment() {
      this.count++
    },
    decrement() {
      this.count--
    },
    // 异步 action
    async incrementAsync() {
      await new Promise(resolve => setTimeout(resolve, 1000))
      this.count++
    }
  }
})
