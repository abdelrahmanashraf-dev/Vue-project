<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

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

const handleLogout = () => {
  authStore.logout()
  showToast('Logged out successfully', 'success', 3000)
  router.push({ name: 'login' })
}
</script>

<template>
  <!-- Overlay for mobile -->
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
    @click="closeSidebar"
  ></div>

  <!-- Sidebar with papyrus theme colors -->
  <aside
    class="fixed md:sticky top-0 left-0 z-50 bg-base-100 border-r border-base-300 w-64 h-screen overflow-y-auto transform transition-transform duration-300 ease-in-out"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'"
  >
    <!-- Header -->
    <div class="p-6 border-b border-base-300">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <span class="text-primary-content text-xl font-bold">📚</span>
          </div>
          <div>
            <h2 class="text-lg font-bold text-base-content">Admin Panel</h2>
            <p class="text-xs text-base-content/70">Books & Authors</p>
          </div>
        </div>
        
        <!-- Close button for mobile -->
        <button
          @click="closeSidebar"
          class="md:hidden p-2 text-base-content/60 hover:text-base-content rounded-lg hover:bg-base-200 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="p-4 flex-1">
      <ul class="space-y-2">
        <li v-for="item in menuItems" :key="item.path">
          <router-link
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group"
            :class="isActive(item) 
              ? 'bg-primary text-primary-content shadow-lg'
              : 'text-base-content hover:bg-base-200'"
            @click="closeSidebar"
          >
            <span 
              class="text-2xl transition-transform" 
              :class="isActive(item) ? 'scale-110' : 'group-hover:scale-110'"
            >
              {{ item.icon }}
            </span>
            <span class="font-semibold">{{ item.label }}</span>
            
            <!-- Active indicator -->
            <span
              v-if="isActive(item)"
              class="ml-auto w-2 h-2 bg-primary-content rounded-full animate-pulse"
            ></span>
          </router-link>
        </li>
      </ul>

      <!-- Divider -->
      <div class="divider my-4"></div>

      <!-- Public Site Link -->
      <router-link
        to="/"
        class="flex items-center gap-3 px-4 py-3 rounded-xl text-base-content hover:bg-base-200 transition-all duration-200 group"
        @click="closeSidebar"
      >
        <span class="text-2xl group-hover:scale-110 transition-transform">🏠</span>
        <span class="font-semibold">Public Site</span>
      </router-link>
    </nav>

    <!-- User Profile Section -->
    <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-base-300 bg-base-200">
      <div class="flex items-center gap-3 px-4 py-3 mb-3">
        <div class="avatar">
          <div class="w-10 h-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
            <img 
              :src="authStore.currentUser?.avatar || 'https://ui-avatars.com/api/?name=Admin+User&background=d4af37&color=fff'" 
              :alt="authStore.currentUser?.name || 'Admin'"
            />
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-semibold text-base-content truncate">
            {{ authStore.currentUser?.name || 'Admin User' }}
          </p>
          <p class="text-xs text-base-content/70 truncate">
            {{ authStore.currentUser?.email || 'admin@example.com' }}
          </p>
        </div>
      </div>

      <!-- Logout Button -->
      <button
        @click="handleLogout"
        class="btn btn-error btn-outline btn-sm w-full gap-2"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Logout
      </button>
    </div>
  </aside>
</template>