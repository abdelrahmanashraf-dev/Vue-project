<template>
  <div 
    class="flex flex-col items-center justify-center text-center px-6"
    :class="[containerClass, paddingClass]"
  >
    <div 
      class="relative mb-6 flex items-center justify-center"
      :class="iconSizeClass"
    >
      
      <div 
        class="absolute inset-0 rounded-full opacity-10"
        :class="bgColorClass"
      ></div>
      
      <div 
        class="absolute inset-0 rounded-full border-4 opacity-20"
        :class="borderColorClass"
      ></div>
      
      <i 
        :class="[icon, iconColorClass, iconTextSizeClass]"
        class="relative z-10"
      ></i>
      
      <div class="absolute -top-2 -right-2 w-4 h-4 rounded-full opacity-30" :class="bgColorClass"></div>
      <div class="absolute -bottom-2 -left-2 w-3 h-3 rounded-full opacity-30" :class="bgColorClass"></div>
    </div>

    <h3 
      class="font-bold mb-3"
      :class="[titleSizeClass, 'text-base-content']"
    >
      {{ title }}
    </h3>

    <p 
      class="text-base-content/70 mb-6"
      :class="descriptionSizeClass"
      v-html="description"
    ></p>

    <div v-if="$slots.actions || showDefaultAction" class="flex flex-wrap gap-3 justify-center">
      <slot name="actions">
        <button 
          v-if="showDefaultAction"
          @click="handleAction"
          class="btn gap-2"
          :class="actionButtonClass"
        >
          <i v-if="actionIcon" :class="actionIcon"></i>
          {{ actionText }}
        </button>
      </slot>
    </div>

    <div v-if="$slots.default" class="mt-6 w-full">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: String,
    default: 'fas fa-inbox'
  },
  iconColor: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'accent', 'info', 'success', 'warning', 'error', 'neutral'].includes(value)
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  actionText: {
    type: String,
    default: ''
  },
  actionIcon: {
    type: String,
    default: ''
  },
  actionButtonClass: {
    type: String,
    default: 'btn-primary'
  },
  showDefaultAction: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  containerClass: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['action'])

const handleAction = () => {
  emit('action')
}

const iconSizeClass = computed(() => {
  const sizes = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-40 h-40'
  }
  return sizes[props.size]
})

const iconTextSizeClass = computed(() => {
  const sizes = {
    sm: 'text-4xl',
    md: 'text-5xl',
    lg: 'text-6xl'
  }
  return sizes[props.size]
})

const titleSizeClass = computed(() => {
  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  }
  return sizes[props.size]
})

const descriptionSizeClass = computed(() => {
  const sizes = {
    sm: 'text-sm max-w-sm',
    md: 'text-base max-w-md',
    lg: 'text-lg max-w-lg'
  }
  return sizes[props.size]
})

const paddingClass = computed(() => {
  const padding = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16'
  }
  return padding[props.size]
})

const iconColorClass = computed(() => `text-${props.iconColor}`)
const bgColorClass = computed(() => `bg-${props.iconColor}`)
const borderColorClass = computed(() => `border-${props.iconColor}`)
</script>