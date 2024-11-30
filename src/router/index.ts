import { createRouter, createWebHistory } from 'vue-router'
import routes from '~pages'
import { useUserStore } from '@/stores/user'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    ...routes
  ]
})

// 全局前置守卫
router.beforeEach((to, from, next) => {
  // 获取用户 store
  const userStore = useUserStore()

  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - My App` : 'My App'

  // 检查是否需要认证
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isLoginPage = to.path === '/login'

  if (requiresAuth) {
    if (!userStore.isLoggedIn) {
      // 如果需要认证但用户未登录，重定向到登录页
      next({
        path: '/login',
        query: { redirect: to.fullPath } // 保存原目标路径
      })
    } else {
      // 已登录且访问需要认证的页面，允许访问
      next()
    }
  } else if (isLoginPage && userStore.isLoggedIn) {
    // 如果已登录但访问登录页，重定向到首页或之前的页面
    const redirectPath = to.query.redirect as string || '/admin'
    next(redirectPath)
  } else {
    // 不需要认证的页面，直接访问
    next()
  }
})

export default router
