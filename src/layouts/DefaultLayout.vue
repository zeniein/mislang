<template>
  <div class="min-h-screen bg-base-200 flex flex-col">
    <TheNavbar />
    <main class="container mx-auto px-4 py-8 flex-grow">
      <router-view></router-view>
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import TheNavbar from '@/components/TheNavbar.vue'
import TheFooter from '@/components/TheFooter.vue'
</script>
