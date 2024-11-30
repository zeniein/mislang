<route lang="yaml">
name: admin
meta:
  requiresAuth: true
  layout: admin
  title: 管理后台
</route>

<template>
  <div>
    <template v-if="router.currentRoute.value.path === '/admin'">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <!-- Stats Cards -->
        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <h2 class="text-sm font-medium text-base-content opacity-70">总用户数</h2>
                <p class="text-lg font-medium text-base-content">12,345</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <h2 class="text-sm font-medium text-base-content opacity-70">今日访问量</h2>
                <p class="text-lg font-medium text-base-content">2,345</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-base-100 shadow-xl">
          <div class="card-body">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="ml-5 w-0 flex-1">
                <h2 class="text-sm font-medium text-base-content opacity-70">总文章数</h2>
                <p class="text-lg font-medium text-base-content">234</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title mb-4">欢迎来到管理后台</h2>
          <p>这里是管理后台的主要内容区域。您可以在这里添加更多的管理功能。</p>
        </div>
      </div>
    </template>
    <router-view v-else></router-view>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

defineOptions({
  name: 'AdminPage',
  meta: {
    title: '管理后台',
    requiresAuth: true
  }
})
</script>
