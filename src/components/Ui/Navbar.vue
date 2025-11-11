<template>
  <nav class="navbar bg-base-100 shadow-sm sticky top-0 z-40">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between w-full gap-4">

        <!-- Logo -->
        <router-link
          to="/"
          class="btn btn-ghost normal-case text-xl flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.757.429L14 17l-3.243 1.929A.5.5 0 0 1 10 18V5H5a2 2 0 0 0-2 2v9h.001V5z"/>
            <path d="M19 7h1a1 1 0 0 1 1 1v9.5a.5.5 0 0 1-.757.429L19 17V7z" />
          </svg>
          <span class="font-semibold hidden sm:inline">Books & Authors</span>
        </router-link>

        <!-- Search -->
        <div class="hidden md:flex flex-1 justify-center max-w-md">
          <div class="form-control w-full">
            <div class="input-group input-group-sm w-full">
              <input
                v-model="query"
                @keyup.enter="onSearch"
                type="search"
                placeholder="Search books or authors..."
                class="input input-sm input-bordered w-full"
              />
            </div>
          </div>
        </div>

        <!-- Links + Auth + Theme + Mobile -->
        <div class="flex items-center gap-2">
          <!-- Desktop Links -->
          <div class="hidden lg:flex items-center gap-1">
            <router-link to="/" class="btn btn-ghost btn-sm">Home</router-link>
            <router-link to="/about" class="btn btn-ghost btn-sm">About</router-link>
            <router-link to="/books" class="btn btn-ghost btn-sm">Books</router-link>
            <router-link to="/authors" class="btn btn-ghost btn-sm">Authors</router-link>
          </div>

          <div class="hidden lg:block divider divider-horizontal mx-0"></div>

          <!-- Auth Section -->
          <div v-if="authStore.isAuthenticated" class="hidden lg:block">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-sm gap-2">
                <div class="avatar">
                  <div class="w-8 rounded-full">
                    <img :src="authStore.currentUser?.avatar" :alt="authStore.currentUser?.name" />
                  </div>
                </div>
                <span class="hidden xl:inline">{{ authStore.currentUser?.name }}</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4">
                <li>
                  <router-link to="/admin" class="gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Admin Dashboard
                  </router-link>
                </li>
                <li class="menu-title">
                  <span>Account</span>
                </li>
                <li>
                  <button @click="handleLogout" class="text-error gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h14m-6 4v1a3 3 0 003 3h4a3 3 0 003-3V7a3 3 0 00-3-3h-4a3 3 0 00-3 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div v-else class="hidden lg:block">
            <router-link to="/login" class="btn btn-primary btn-sm gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Login
            </router-link>
          </div>

          <!-- Theme Toggle -->
          <button
            class="btn btn-ghost btn-sm btn-square"
            @click="toggleTheme"
            :title="isDark ? 'Switch to light' : 'Switch to dark'"
          >
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>

          <!-- Mobile Menu -->
          <button @click="mobileOpen = !mobileOpen" class="btn btn-ghost btn-sm btn-square lg:hidden">
            <svg v-if="!mobileOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="slide">
      <div v-show="mobileOpen" class="lg:hidden border-t border-base-200 bg-base-100">
        <div class="px-4 py-3">
          <div class="form-control mb-3 md:hidden">
            <div class="input-group input-group-sm">
              <input
                v-model="query"
                @keyup.enter="onSearch"
                type="search"
                placeholder="Search..."
                class="input input-sm input-bordered flex-1"
              />
              <button @click="onSearch" class="btn btn-sm btn-primary">Go</button>
            </div>
          </div>
          <ul class="menu menu-compact p-0">
            <li><router-link @click="closeMobile" to="/">Home</router-link></li>
            <li><router-link @click="closeMobile" to="/about">About</router-link></li>
            <li><router-link @click="closeMobile" to="/books">Books</router-link></li>
            <li><router-link @click="closeMobile" to="/authors">Authors</router-link></li>
            
            <li class="menu-title mt-2">
              <span>Account</span>
            </li>
            
            <li v-if="authStore.isAuthenticated">
              <router-link @click="closeMobile" to="/admin">Admin Dashboard</router-link>
            </li>
            <li v-if="authStore.isAuthenticated">
              <button @click="handleLogout" class="text-error">Logout</button>
            </li>
            <li v-else>
              <router-link @click="closeMobile" to="/login">Login</router-link>
            </li>
          </ul>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const mobileOpen = ref(false)
const query = ref('')
const isDark = ref(false)

onMounted(() => {
  const saved = document.documentElement.getAttribute('data-theme')
  isDark.value = saved === 'dark'
})

function closeMobile() {
  mobileOpen.value = false
}

function onSearch() {
  if (!query.value.trim()) return
  router.push({ path: '/books', query: { q: query.value.trim() } })
  closeMobile()
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light'
  const next = current === 'light' ? 'dark' : 'light'
  document.documentElement.setAttribute('data-theme', next)
  isDark.value = next === 'dark'
}

function handleLogout() {
  authStore.logout()
  showToast('Logged out successfully', 'success', 3000)
  router.push({ name: 'home' })
  closeMobile()
}
</script>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease;
  max-height: 400px;
  overflow: hidden;
}
.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
}
.router-link-active {
  background-color: hsl(var(--b3) / 0.5);
}
</style>