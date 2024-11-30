<route lang="yaml">
name: home
meta:
  requiresAuth: false
  layout: default
  icon: home
  order: 1
</route>

<template>
  <div class="hero min-h-[calc(100vh-4rem)]">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">Welcome to MisLang</h1>
        <p class="py-6">
          A modern Vue 3 application with TypeScript, Pinia, and DaisyUI.
          Experience the power of modern web development with our beautiful UI.
        </p>
        <div class="flex gap-4 justify-center">
          <router-link to="/about" class="btn btn-primary">Learn More</router-link>
          <router-link to="/profile" class="btn btn-ghost">View Profile</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Home page component logic
</script>

<style>
/* Component styles */
</style>
