<template>
  <footer class="footer bg-base-100 text-base-content border-t border-base-300 px-6 ">
    <div class="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.757.429L14 17l-3.243 1.929A.5.5 0 0 1 10 18V5H5a2 2 0 0 0-2 2v9h.001V5z"/>
            <path d="M19 7h1a1 1 0 0 1 1 1v9.5a.5.5 0 0 1-.757.429L19 17V7z" />
          </svg>
          <span class="font-semibold text-lg">Books & Authors</span>
        </router-link>
        <p class="text-sm opacity-70 mt-3 max-w-sm">
          Discover books and authors—built with Vue 3, Tailwind & DaisyUI.
        </p>
      </div>

      <div class="flex justify-between md:justify-center">
        <div>
          <h4 class="font-medium mb-2 text-base-content">Site</h4>
          <ul class="space-y-1 text-sm opacity-80">
            <li>
              <router-link to="/" class="hover:text-primary hover:underline transition-colors">
                Home
              </router-link>
            </li>
            <li>
              <router-link to="/books" class="hover:text-primary hover:underline transition-colors">
                Books
              </router-link>
            </li>
            <li>
              <router-link to="/authors" class="hover:text-primary hover:underline transition-colors">
                Authors
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-primary hover:underline transition-colors">
                About
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="text-sm">
        <h4 class="font-medium mb-2 text-base-content">Connect</h4>
        <div class="flex gap-3">
          <a 
            aria-label="Github" 
            href="#" 
            class="btn btn-ghost btn-sm hover:bg-base-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Github
          </a>
          <a 
            aria-label="Twitter" 
            href="#" 
            class="btn btn-ghost btn-sm hover:bg-base-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </a>
        </div>
        <p class="mt-4 text-xs opacity-60">
          © {{ year }} Books & Authors. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const year = new Date().getFullYear()
</script>

<style scoped>
.router-link-exact-active {
  @apply text-primary font-medium;
}
</style>