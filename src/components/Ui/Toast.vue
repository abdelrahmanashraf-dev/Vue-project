<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  show: Boolean,
  message: String,
  type: {
    type: String,
    default: 'success', // success, error, warning, info
    validator: (val) => ['success', 'error', 'warning', 'info'].includes(val)
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const visible = ref(props.show)
let timeout = null

watch(() => props.show, (newVal) => {
  visible.value = newVal
  if (newVal) {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      close()
    }, props.duration)
  }
})

const close = () => {
  visible.value = false
  emit('close')
}

const getToastClasses = () => {
  const baseClasses = 'px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 min-w-80'
  const typeClasses = {
    success: 'bg-emerald-500 text-white',
    error: 'bg-red-500 text-white',
    warning: 'bg-amber-500 text-white',
    info: 'bg-blue-500 text-white'
  }
  return `${baseClasses} ${typeClasses[props.type]}`
}

const getIcon = () => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[props.type]
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="transform translate-y-2 opacity-0"
    enter-to-class="transform translate-y-0 opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="transform translate-y-0 opacity-100"
    leave-to-class="transform translate-y-2 opacity-0"
  >
    <div
      v-if="visible"
      class="fixed top-20 right-6 z-50"
      role="alert"
    >
      <div :class="getToastClasses()">
        <span class="text-2xl font-bold">{{ getIcon() }}</span>
        <p class="flex-1 font-medium">{{ message }}</p>
        <button
          @click="close"
          class="ml-2 text-white hover:text-gray-200 transition-colors"
          aria-label="Close"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>