<template>
  <div class="flex h-screen overflow-hidden bg-base-200">
    <!-- Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobile && isMobileMenuOpen"
        class="fixed inset-0 z-20 bg-black bg-opacity-50"
        @click="toggleMobileMenu"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside
      class="flex h-full flex-col border-r bg-base-100 shadow-lg transition-all duration-500 ease-in-out"
      :class="sidebarClass"
    >
      <!-- Logo -->
      <div class="flex h-16 items-center justify-start border-b px-4">
        <div class="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-content">
          ML
        </div>
        <div class="relative ml-3 h-8 overflow-hidden" :class="[isCollapsed ? 'w-0' : 'w-40']">
          <span class="absolute whitespace-nowrap text-xl font-semibold transition-all duration-500"
            :class="[isCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100']"
          >
            MisLang
          </span>
        </div>
      </div>

      <!-- Menu Items -->
      <nav class="flex-1 space-y-1 overflow-y-auto p-4">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="group flex items-center rounded-lg p-2 hover:bg-base-200"
          :class="{ 'bg-base-200 text-primary': isActive(item.path) }"
        >
          <component
            :is="item.icon"
            class="min-w-[1.25rem] transition-transform duration-300 group-hover:scale-110"
          />
          <div class="relative ml-3 h-5 overflow-hidden" :class="[isCollapsed ? 'w-0' : 'w-40']">
            <span 
              class="absolute whitespace-nowrap transition-all duration-500"
              :class="[isCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100']"
            >
              {{ item.label }}
            </span>
          </div>
          <div
            v-if="isCollapsed && !isMobile"
            class="absolute left-full z-50 ml-2 hidden translate-y-0 rounded-lg bg-base-100 px-2 py-1 text-sm shadow-lg group-hover:block"
          >
            {{ item.label }}
          </div>
        </router-link>
      </nav>

      <!-- Sidebar Footer with Collapse Button -->
      <div class="border-t p-4">
        <button
          v-if="!isMobile"
          @click="toggleSidebar"
          class="flex w-full items-center justify-center gap-2 rounded-lg p-2 hover:bg-base-200"
        >
          <component
            :is="ChevronLeftIcon"
            class="min-w-[1.25rem] transition-transform duration-500"
            :class="{ 'rotate-180': isCollapsed }"
          />
          <div class="relative h-5 overflow-hidden" :class="[isCollapsed ? 'w-0' : 'w-16']">
            <span 
              class="absolute whitespace-nowrap transition-all duration-500"
              :class="[isCollapsed ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100']"
            >
              {{ isCollapsed ? '展开' : '收起' }}
            </span>
          </div>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="relative flex flex-1 flex-col overflow-hidden">
      <!-- Top Navigation -->
      <header class="sticky top-0 z-10 bg-base-100 p-4 shadow">
        <div class="flex items-center justify-between">
          <button
            class="btn btn-ghost btn-sm lg:hidden"
            @click="toggleMobileMenu"
          >
            <component :is="MenuIcon" />
          </button>
          <div class="flex items-center gap-4">
            <button
              @click="handleLogout"
              class="btn btn-ghost btn-sm"
            >
              退出登录
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <div class="flex-1 overflow-auto p-6">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { menuItems } from '../config/menu'
import { MenuIcon, ChevronLeftIcon } from '../components/icons'

const router = useRouter()
const userStore = useUserStore()
const isCollapsed = ref(false)
const isMobileMenuOpen = ref(false)
const isMobile = ref(false)

// 检查是否为移动设备
const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024 // lg breakpoint
  if (isMobile.value) {
    isCollapsed.value = true
  }
}

// 监听窗口大小变化
onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const sidebarClass = computed(() => ({
  'fixed lg:relative': true,
  'z-30': true,
  '-translate-x-full lg:translate-x-0': isMobile.value && !isMobileMenuOpen.value,
  'translate-x-0': !isMobile.value || (isMobile.value && isMobileMenuOpen.value),
  'w-20': isCollapsed.value,
  'w-64': !isCollapsed.value
}))

const toggleSidebar = () => {
  if (!isMobile.value) {
    isCollapsed.value = !isCollapsed.value
  }
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const handleRouteChange = () => {
  if (isMobile.value) {
    isMobileMenuOpen.value = false
  }
}

const isActive = (path: string) => router.currentRoute.value.path === path

const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// 监听路由变化
router.afterEach(handleRouteChange)
</script>
