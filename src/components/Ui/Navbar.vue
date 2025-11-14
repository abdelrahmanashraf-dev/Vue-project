<template>
  <nav class="navbar bg-[#f8f5f0] text-gray-800 shadow-md sticky top-0 z-40 px-6" >
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between w-full gap-4">
        <router-link
          to="/"
          class="btn btn-ghost normal-case text-xl flex items-center gap-2 text-gray-800 hover:bg-gray-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-[#d4af37]" fill="currentColor" viewBox="0 0 24 24">
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
                class="input input-sm input-bordered w-full bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-[#d4af37]"
              />
              <button
                @click="onSearch"
                class="btn btn-sm bg-[#d4af37] hover:bg-[#c19e35] border-none text-white"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="hidden lg:flex items-center gap-1">
            <router-link to="/" exact class="btn btn-ghost btn-sm text-gray-700 hover:bg-gray-200">Home</router-link>
            <router-link to="/about" class="btn btn-ghost btn-sm text-gray-700 hover:bg-gray-200">About</router-link>
            <router-link to="/books" class="btn btn-ghost btn-sm text-gray-700 hover:bg-gray-200">Books</router-link>
            <router-link to="/authors" class="btn btn-ghost btn-sm text-gray-700 hover:bg-gray-200">Authors</router-link>
          </div>

          <div class="hidden lg:block divider divider-horizontal mx-0 bg-gray-300 w-[1px]"></div>

          <div v-if="authStore.isAuthenticated" class="hidden lg:block">
            <div class="dropdown dropdown-end">
              <label tabindex="0" class="btn btn-ghost btn-sm gap-2 text-gray-700 hover:bg-gray-200">
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
              <ul tabindex="0" class="dropdown-content menu p-2 shadow-lg bg-white text-gray-800 rounded-box w-52 mt-4 z-50">
                <li>
                  <router-link to="/admin" class="gap-2 hover:bg-gray-100">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Admin Dashboard
                  </router-link>
                </li>
                <li class="menu-title text-gray-500">Account</li>
                <li>
                  <button @click="handleLogout" class="text-error gap-2 hover:bg-gray-100">
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
            <router-link
              to="/login"
              class="btn btn-sm bg-[#d4af37] hover:bg-[#c19e35] border-none text-white"
            >
              Login
            </router-link>
          </div>

          <button @click="mobileOpen = !mobileOpen" class="btn btn-ghost btn-sm btn-square lg:hidden text-gray-700 hover:bg-gray-200">
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

    <div v-if="mobileOpen" class="lg:hidden absolute top-full left-0 w-full bg-white shadow-xl p-4 z-30 transition-all duration-300 ease-in-out border-t border-gray-200">
        <div class="form-control w-full mb-4">
            <div class="flex items-center gap-2">
                <input
                    v-model="query"
                    @keyup.enter="onSearch"
                    type="search"
                    placeholder="Search books or authors..."
                    class="input input-sm input-bordered w-full bg-gray-50 border-gray-300 text-gray-800 placeholder-gray-500 focus:border-[#d4af37]"
                />
                <button
                    @click="onSearch"
                    class="btn btn-sm bg-[#d4af37] mb-[3px] hover:bg-[#c19e35] border-none text-white"
                    >
                    Search
                </button>
            </div>
        </div>

        <ul class="menu w-full p-0 text-gray-800">
            <li><router-link @click="mobileOpen = false" to="/" exact class="hover:bg-gray-100">Home</router-link></li>
            <li><router-link @click="mobileOpen = false" to="/about" class="hover:bg-gray-100">About</router-link></li>
            <li><router-link @click="mobileOpen = false" to="/books" class="hover:bg-gray-100">Books</router-link></li>
            <li><router-link @click="mobileOpen = false" to="/authors" class="hover:bg-gray-100">Authors</router-link></li>
        </ul>
        
        <div class="divider text-gray-300"></div>

        <div v-if="authStore.isAuthenticated">
            <ul class="menu w-full p-0 text-gray-800">
                <li class="menu-title text-gray-500">Account for {{ authStore.currentUser?.name }}</li>
                <li>
                    <router-link @click="mobileOpen = false" to="/admin" class="gap-2 hover:bg-gray-100">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Admin Dashboard
                    </router-link>
                </li>
                <li>
                    <button @click="handleLogout" class="text-error gap-2 hover:bg-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h14m-6 4v1a3 3 0 003 3h4a3 3 0 003-3V7a3 3 0 00-3-3h-4a3 3 0 00-3 3v1" />
                        </svg>
                        Logout
                    </button>
                </li>
            </ul>
        </div>
        <div v-else>
            <router-link
              @click="mobileOpen = false"
              to="/login"
              class="btn btn-sm w-full bg-[#d4af37] hover:bg-[#c19e35] border-none text-white mt-2"
            >
              Login
            </router-link>
        </div>
    </div>
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
/* استخدم exact-active بدل active عشان Home ميفضلش active دايماً */
.router-link-exact-active {
  background-color: rgba(212, 175, 55, 0.15); 
  color: #374151 !important;
}

.menu li a {
    border-radius: 0.5rem;
}
</style>