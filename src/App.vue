<script setup>
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-8 p-8">
    <h1 class="text-5xl font-bold text-primary">
      🚀 Tailwind & DaisyUI Test
    </h1>

    <!-- DaisyUI -->
    <div class="flex gap-4">
      <button class="btn btn-primary">Primary</button>
      <button class="btn btn-secondary">Secondary</button>
      <button class="btn btn-accent">Accent</button>
    </div>

    <!-- Card DaisyUI -->
    <div class="card w-96 bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">DaisyUI Card</h2>
        <p>If you can see colors and this nice card — DaisyUI works perfectly!</p>
        <div class="card-actions justify-end">
          <button class="btn btn-info">Confirm</button>
        </div>
      </div>
    </div>

    <RouterView />
  </div>
</template>

<style scoped>
</style>
