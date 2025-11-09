<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const route = useRoute()

const menuItems = [
  {
    path: '/admin',
    icon: '📊',
    label: 'Dashboard',
    exact: true
  },
  {
    path: '/admin/books',
    icon: '📚',
    label: 'Books'
  },
  {
    path: '/admin/authors',
    icon: '✍️',
    label: 'Authors'
  }
]

const isActive = (item) => {
  if (item.exact) {
    return route.path === item.path
  }
  return route.path.startsWith(item.path)
}

const closeSidebar = () => {
  emit('close')
}
</script>

<template>
  <!-- Overlay for mobile -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar -->
  <aside
    class="fixed md:sticky top-0 left-0 z-50 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- Header -->
    <div class="p-6 border-b border-gray-200 dark:border-gray-700">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span class="text-white text-xl font-bold">📚</span>
          </div>
          <div>
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h2>
            <p class="text-xs text-gray-500 dark:text-gray-400">Books & Authors</p>
          </div>
        </div>
        
        <!-- Close button for mobile -->
        <button
          @click="closeSidebar"
          class="md:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="p-4">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            :class="isActive(item) 
              ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'"
            @click="closeSidebar"
          >
            <span class="text-2xl" :class="isActive(item) ? 'scale-110' : 'group-hover:scale-110 transition-transform'">
              {{ item.icon }}
            </span>
            <span class="font-semibold">{{ item.label }}</span>
            
            <!-- Active indicator -->
            <span
              v-if="isActive(item)"
              class="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"
            ></span>
          </router-link>
        </li>
      </ul>
    </nav>

    <!-- User Profile Section (Optional) -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
      <div class="flex items-center gap-3 px-4 py-3">
        <div class="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
        <div class="flex-1">
          <p class="text-sm font-semibold text-gray-900 dark:text-white">Admin User</p>
          <p class="text-xs text-gray-500 dark:text-gray-400">admin@example.com</p>
        </div>
      </div>
    </div>
  </aside>
</template>