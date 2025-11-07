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

        <!-- Links + Theme + Mobile -->
        <div class="flex items-center gap-2">
          <div class="hidden lg:flex items-center gap-1">
            <router-link to="/" class="btn btn-ghost btn-sm">Home</router-link>
            <router-link to="/about" class="btn btn-ghost btn-sm">About</router-link>
            <router-link to="/books" class="btn btn-ghost btn-sm">Books</router-link>
            <router-link to="/authors" class="btn btn-ghost btn-sm">Authors</router-link>
          </div>

          <div class="hidden lg:block divider divider-horizontal mx-0"></div>

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
          </ul>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
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
