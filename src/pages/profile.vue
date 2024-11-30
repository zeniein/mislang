<route lang="yaml">
name: profile
meta:
  title: Profile
  requiresAuth: true
  layout: default
  icon: user
  order: 3
</route>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()
const { userDisplayName, userInfo } = storeToRefs(userStore)

onMounted(() => {
  if (!userStore.isLoggedIn) {
    router.push('/')
  }
})
</script>

<template>
  <div class="profile">
    <h1>Profile Page</h1>
    <div class="profile-info">
      <h2>Welcome, {{ userDisplayName }}!</h2>
      <p>{{ userInfo }}</p>
    </div>
    <nav>
      <router-link to="/">Back to Home</router-link>
    </nav>
  </div>
</template>

<style lang="scss" scoped>
.profile {
  padding: 2rem;
  text-align: center;

  .profile-info {
    margin: 2rem 0;
    padding: 1rem;
    border: 1px solid $primary-color;
    border-radius: 4px;
  }

  nav {
    margin-top: 2rem;

    a {
      color: $primary-color;
      text-decoration: none;
      padding: 0.5rem 1rem;
      border: 1px solid $primary-color;
      border-radius: 4px;

      &:hover {
        background-color: $primary-color;
        color: white;
      }
    }
  }
}
</style>
