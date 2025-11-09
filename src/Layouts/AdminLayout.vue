<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
  <div class="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
    <!-- Sidebar -->
    <AdminSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Top Bar (Mobile) -->
      <header class="md:hidden sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
        <div class="flex items-center justify-between">
          <button
            @click="toggleSidebar"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="flex items-center gap-2">
            <span class="text-xl">📚</span>
            <span class="font-bold text-gray-900 dark:text-white">Admin Panel</span>
          </div>
          
          <div class="w-10"></div> <!-- Spacer for centering -->
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 md:p-6 overflow-auto">
        <router-view />
      </main>
    </div>
  </div>
</template>