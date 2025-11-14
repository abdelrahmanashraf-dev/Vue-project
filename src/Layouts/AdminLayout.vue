<script setup>
import { ref } from 'vue'
import AdminSidebar from '@/components/AdminSidebar.vue'
import Toast from '@/components/Ui/Toast.vue'
import { useToast } from '@/composables/useToast'

const isSidebarOpen = ref(false)
const { toastState, hideToast } = useToast()

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  isSidebarOpen.value = false
}
</script>

<template>
   <div data-theme="papyrus" class="flex min-h-screen">
    <!-- Sidebar -->
    <AdminSidebar :is-open="isSidebarOpen" @close="closeSidebar" />

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Top Bar (Mobile) -->
      <header class="md:hidden sticky top-0 z-30 bg-base-100 border-b border-base-300 px-4 py-3 shadow-sm">
        <div class="flex items-center justify-between">
          <button
            @click="toggleSidebar"
            class="p-2 text-base-content/70 hover:text-base-content rounded-lg hover:bg-base-200 transition-all"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div class="flex items-center gap-2">
            <span class="text-xl">📚</span>
            <span class="font-bold text-base-content">Admin Panel</span>
          </div>
          
          <div class="w-10"></div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-4 md:p-6 overflow-auto bg-base-200">
        <router-view />
      </main>
    </div>

    <!-- Toast Notification -->
    <Toast
      :show="toastState.show"
      :message="toastState.message"
      :type="toastState.type"
      :duration="toastState.duration"
      @close="hideToast"
    />
  </div>
</template>