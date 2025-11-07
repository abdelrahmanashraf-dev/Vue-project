<template>
  <footer class="footer bg-base-200 text-base-content border-t mt-12">
    <div class="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <router-link to="/" class="flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.757.429L14 17l-3.243 1.929A.5.5 0 0 1 10 18V5H5a2 2 0 0 0-2 2v9h.001V5z"/>
            <path d="M19 7h1a1 1 0 0 1 1 1v9.5a.5.5 0 0 1-.757.429L19 17V7z" />
          </svg>
          <span class="font-semibold text-lg">Books & Authors</span>
        </router-link>
        <p class="text-sm text-gray-600 mt-3 max-w-sm">
          Discover books and authors—built with Vue 3, Tailwind & DaisyUI.
        </p>
      </div>

      <div class="flex justify-between md:justify-center">
        <div>
          <h4 class="font-medium mb-2">Site</h4>
          <ul class="space-y-1 text-sm">
            <li><router-link to="/" class="hover:underline">Home</router-link></li>
            <li><router-link to="/books" class="hover:underline">Books</router-link></li>
            <li><router-link to="/authors" class="hover:underline">Authors</router-link></li>
            <li><router-link to="/about" class="hover:underline">About</router-link></li>
          </ul>
        </div>
      </div>

      <div class="text-sm">
        <h4 class="font-medium mb-2">Connect</h4>
        <div class="flex gap-3">
          <a aria-label="Github" href="#" class="btn btn-ghost btn-sm">Github</a>
          <a aria-label="Twitter" href="#" class="btn btn-ghost btn-sm">Twitter</a>
        </div>
        <p class="mt-4 text-xs text-gray-500">© {{ year }} Books & Authors</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
const year = new Date().getFullYear()
</script>
