<template>
  <nav class="navbar bg-base-100 text-base-content shadow-md sticky top-0 z-40 px-6">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between w-full gap-4">
        <router-link
          to="/"
          class="btn btn-ghost normal-case text-xl flex items-center gap-2 hover:bg-base-200"
        >
          <i class="fas fa-book text-primary text-2xl"></i>
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
                <i class="fas fa-search"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="hidden lg:flex items-center gap-1">
            <router-link to="/" exact class="btn btn-ghost btn-sm hover:bg-base-200">
              Home
            </router-link>
            <router-link to="/about" class="btn btn-ghost btn-sm hover:bg-base-200">
             About
            </router-link>
            <router-link to="/books" class="btn btn-ghost btn-sm hover:bg-base-200">
             Books
            </router-link>
            <router-link to="/authors" class="btn btn-ghost btn-sm hover:bg-base-200">
              Authors
            </router-link>
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
                <i class="fas fa-chevron-down text-xs"></i>
              </label>
              <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-base-100 rounded-box w-52 mt-4 z-50 border border-base-300">
                <li>
                  <router-link to="/admin" class="gap-2 hover:bg-base-200">
                    <i class="fas fa-chart-line text-primary"></i>
                    Admin Dashboard
                  </router-link>
                </li>
                <li class="menu-title">
                  <span class="text-base-content opacity-60">Account</span>
                </li>
                <li>
                  <button @click="handleLogout" class="text-error gap-2 hover:bg-error hover:bg-opacity-10">
                    <i class="fas fa-sign-out-alt"></i>
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
              <i class="fas fa-sign-in-alt mr-1"></i>Login
            </router-link>
          </div>

          <button @click="mobileOpen = !mobileOpen" class="btn btn-ghost btn-sm btn-square lg:hidden hover:bg-base-200">
            <i v-if="!mobileOpen" class="fas fa-bars text-xl"></i>
            <i v-else class="fas fa-times text-xl"></i>
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
                <i class="fas fa-search"></i>
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
              <i class="fas fa-home text-primary"></i>
              Home
            </router-link>
            
            <router-link 
              @click="mobileOpen = false" 
              to="/about" 
              class="mobile-nav-link"
            >
              <i class="fas fa-info-circle text-secondary"></i>
              About
            </router-link>
            
            <router-link 
              @click="mobileOpen = false" 
              to="/books" 
              class="mobile-nav-link"
            >
              <i class="fas fa-book text-accent"></i>
              Books
            </router-link>
            
            <router-link 
              @click="mobileOpen = false" 
              to="/authors" 
              class="mobile-nav-link"
            >
              <i class="fas fa-users text-primary"></i>
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
              <i class="fas fa-chart-line text-primary"></i>
              Admin Dashboard
            </router-link>

            <button 
              @click="handleLogout" 
              class="mobile-nav-link text-error hover:bg-error hover:bg-opacity-10 w-full text-left"
            >
              <i class="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>

          <div v-else>
            <router-link
              @click="mobileOpen = false"
              to="/login"
              class="btn btn-block btn-primary"
            >
              <i class="fas fa-sign-in-alt mr-2"></i>
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

.mobile-nav-link i {
  @apply flex-shrink-0 text-lg;
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