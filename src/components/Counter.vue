<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

const store = useCounterStore()
// 使用 storeToRefs 保持响应性
const { count, name } = storeToRefs(store)
// 直接解构 actions
const { increment, decrement, incrementAsync } = store
</script>

<template>
  <div class="counter">
    <h2>{{ name }}</h2>
    <div class="counter-display">
      <p>Count: {{ count }}</p>
      <p>Double Count: {{ store.doubleCount }}</p>
      <p>Double Count + 5: {{ store.doubleCountPlus(5) }}</p>
    </div>
    <div class="counter-controls">
      <button @click="decrement">-</button>
      <button @click="increment">+</button>
      <button @click="incrementAsync">+ Async</button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.counter {
  padding: 2rem;
  text-align: center;

  .counter-display {
    margin: 1rem 0;
    font-size: 1.2rem;
  }

  .counter-controls {
    display: flex;
    gap: 1rem;
    justify-content: center;

    button {
      padding: 0.5rem 1rem;
      font-size: 1.2rem;
      border: 1px solid $primary-color;
      background-color: white;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: $primary-color;
        color: white;
      }
    }
  }
}
</style>
