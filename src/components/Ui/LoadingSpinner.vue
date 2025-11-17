<template>
  <div class="flex flex-col items-center justify-center py-12" :class="containerClass">
    <div class="relative">
      <div class="absolute inset-0 flex items-center justify-center">
        <div class="w-20 h-20 border-4 border-primary/20 rounded-full"></div>
      </div>
      
      <span 
        :class="[
          'loading loading-spinner',
          sizeClass,
          colorClass
        ]"
      ></span>
      
      <div class="absolute inset-0 flex items-center justify-center animate-pulse">
        <div class="w-24 h-24 flex items-center justify-center">
          <i class="fas fa-book-open text-primary/30 text-2xl"></i>
        </div>
      </div>
    </div>

    <p 
      v-if="message" 
      class="mt-6 text-base font-medium animate-pulse"
      :class="textColorClass"
    >
      {{ message }}
    </p>

    <p 
      v-if="subtext" 
      class="mt-2 text-sm opacity-70"
      :class="textColorClass"
    >
      {{ subtext }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'lg',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  color: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error'].includes(value)
  },
  message: {
    type: String,
    default: 'Loading...'
  },
  subtext: {
    type: String,
    default: ''
  },
  containerClass: {
    type: String,
    default: ''
  }
})

const sizeClass = computed(() => {
  const sizes = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg',
    xl: 'w-16 h-16'
  }
  return sizes[props.size]
})

const colorClass = computed(() => `text-${props.color}`)
const textColorClass = computed(() => 'text-base-content')
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>