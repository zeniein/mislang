<route lang="yaml">
name: about
meta:
  title: About
  requiresAuth: false
  layout: default
  icon: info
  order: 2
</route>

<script setup lang="ts">
// Component logic here
</script>

<template>
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">About Us</h1>
        <p class="py-6">Welcome to our application! We're using Vue 3 with DaisyUI for a beautiful and responsive user interface.</p>
        <button class="btn btn-primary">Get Started</button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Removed existing styles as they are no longer needed */
</style>
