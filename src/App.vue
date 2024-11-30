<script setup lang="ts">
// App root component
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import CleanLayout from '@/layouts/CleanLayout.vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const themeStore = useThemeStore()
const userStore = useUserStore()

const getLayout = () => {
  switch (route.meta.layout) {
    case 'admin':
      return AdminLayout
    case 'clean':
      return CleanLayout
    default:
      return DefaultLayout
  }
}

onMounted(() => {
  themeStore.initTheme()
  // 检查并恢复登录状态
  userStore.checkAuth()
})
</script>

<template>
  <component :is="getLayout()" />
</template>

<style lang="scss">
.app {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
