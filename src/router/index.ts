import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { useUserStore } from '@/stores/user'

export const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取用户 store
  const userStore = useUserStore()

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - My App` : 'My App'

  // 检查是否需要认证
  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    // 如果需要认证但用户未登录，重定向到首页
    next({ path: '/' })
  } else {
    next()
  }
})

export default router
