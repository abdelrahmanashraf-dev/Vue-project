<template>
  <nav class="navbar bg-base-100 text-base-content shadow-md sticky top-0 z-40 px-6">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between w-full gap-4">
        <router-link
          to="/"
          class="btn btn-ghost normal-case text-xl flex items-center gap-2 hover:bg-base-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.757.429L14 17l-3.243 1.929A.5.5 0 0 1 10 18V5H5a2 2 0 0 0-2 2v9h.001V5z"/>
            <path d="M19 7h1a1 1 0 0 1 1 1v9.5a.5.5 0 0 1-.757.429L19 17V7z" />
          </svg>
          <span class="font-semibold hidden sm:inline">Books & Authors</span>
        </router-link>

        <div class="hidden md:flex flex-1 justify-center max-w-md">
          <div class="form-control w-full">
            <div class="flex items-center gap-2">
              <input
                v-model="query"
                @keyup.enter="onSearch"
                type="search"
                placeholder="Search books or authors..."
                class="input input-sm input-bordered w-full bg-base-200 focus:border-primary"
              />
              <button
                @click="onSearch"
                class="btn btn-sm btn-primary"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="hidden lg:flex items-center gap-1">
            <router-link to="/" exact class="btn btn-ghost btn-sm hover:bg-base-200">Home</router-link>
            <router-link to="/about" class="btn btn-ghost btn-sm hover:bg-base-200">About</router-link>
            <router-link to="/books" class="btn btn-ghost btn-sm hover:bg-base-200">Books</router-link>
            <router-link to="/authors" class="btn btn-ghost btn-sm hover:bg-base-200">Authors</router-link>
          </div>

          <div class="hidden lg:block divider divider-horizontal mx-0"></div>

          <div v-if="authStore.isAuthenticated" class="hidden lg:block">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-sm gap-2 hover:bg-base-200">
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
              <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4 z-50 border border-base-300">
                <li>
                  <router-link to="/admin" class="gap-2 hover:bg-base-200">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Admin Dashboard
                  </router-link>
                </li>
                <li class="menu-title">
                  <span class="text-base-content opacity-60">Account</span>
                </li>
                <li>
                  <button @click="handleLogout" class="text-error gap-2 hover:bg-error hover:bg-opacity-10">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div v-else class="hidden lg:block">
            <router-link
              to="/login"
              class="btn btn-sm btn-primary"
            >
              Login
            </router-link>
          </div>

          <button @click="mobileOpen = !mobileOpen" class="btn btn-ghost btn-sm btn-square lg:hidden hover:bg-base-200">
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
    <transition name="slide-fade">
      <div v-if="mobileOpen" class="lg:hidden absolute top-full left-0 w-full bg-base-100 shadow-xl border-t border-base-300 z-30">
        <div class="container mx-auto px-6 py-4 space-y-4">
          <!-- Search Section -->
          <div class="w-full">
            <div class="flex items-center gap-2">
              <input
                v-model="query"
                @keyup.enter="onSearch"
                type="search"
                placeholder="Search books or authors..."
                class="input input-sm input-bordered flex-1 bg-base-200 focus:border-primary focus:outline-none"
              />
              <button
                @click="onSearch"
                class="btn btn-sm btn-primary px-6"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Navigation Links -->
          <div class="space-y-1">
            <router-link 
              @click="mobileOpen = false" 
              to="/" 
              exact 
              class="mobile-nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Home
            </router-link>
            
            <router-link 
              @click="mobileOpen = false" 
              to="/about" 
              class="mobile-nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </router-link>
            
            <router-link 
              @click="mobileOpen = false" 
              to="/books" 
              class="mobile-nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.757.429L14 17l-3.243 1.929A.5.5 0 0 1 10 18V5H5a2 2 0 0 0-2 2v9h.001V5z"/>
              </svg>
              Books
            </router-link>
            
            <router-link 
              @click="mobileOpen = false" 
              to="/authors" 
              class="mobile-nav-link"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Authors
            </router-link>
          </div>

          <div class="divider my-2"></div>

          <!-- User Section -->
          <div v-if="authStore.isAuthenticated" class="space-y-2">
            <div class="flex items-center gap-3 px-3 py-2 bg-base-200 rounded-lg">
              <div class="avatar">
                <div class="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img :src="authStore.currentUser?.avatar" :alt="authStore.currentUser?.name" />
                </div>
              </div>
              <div class="flex-1">
                <p class="font-semibold text-base-content text-sm">{{ authStore.currentUser?.name }}</p>
                <p class="text-xs opacity-60">{{ authStore.currentUser?.email }}</p>
              </div>
            </div>

            <router-link 
              @click="mobileOpen = false" 
              to="/admin" 
              class="mobile-nav-link bg-base-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Admin Dashboard
            </router-link>

            <button 
              @click="handleLogout" 
              class="mobile-nav-link text-error hover:bg-error hover:bg-opacity-10 w-full text-left"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>

          <div v-else>
            <router-link
              @click="mobileOpen = false"
              to="/login"
              class="btn btn-block btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              Login
            </router-link>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { showToast } = useToast()

const mobileOpen = ref(false)
const query = ref('')

function onSearch() {
  if (!query.value.trim()) return
  router.push({ path: '/books', query: { q: query.value.trim() } })
  mobileOpen.value = false
}

function handleLogout() {
  authStore.logout()
  showToast('Logged out successfully', 'success', 3000)
  router.push({ name: 'home' })
  mobileOpen.value = false
}
</script>

<style scoped>
.router-link-exact-active {
  background-color: rgb(212 175 55 / 0.15); 
  color: var(--base-content) !important;
}

.mobile-nav-link {
  @apply flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 hover:bg-base-200 active:scale-95;
}

.mobile-nav-link svg {
  @apply flex-shrink-0;
}

.router-link-exact-active.mobile-nav-link {
  @apply bg-primary bg-opacity-10 font-semibold;
}

/* Slide fade transition */
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.2s ease-in;
}

.slide-fade-enter-from {
  transform: translateY(-10px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>