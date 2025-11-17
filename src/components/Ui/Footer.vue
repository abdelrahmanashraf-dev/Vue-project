<template>
  <footer class="footer bg-base-100 text-base-content border-t border-base-300 px-6">
    <div class="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <router-link to="/" class="flex items-center gap-3 hover:opacity-80 transition-opacity">
          
          <span class="font-semibold text-lg">Books & Authors</span>
        </router-link>
        <p class="text-sm opacity-70 mt-3 max-w-sm">
          Discover books and authors—built with Vue 3, Tailwind & DaisyUI.
        </p>
      </div>

      <div class="flex justify-between md:justify-center">
        <div>
          <h4 class="font-medium mb-2 text-base-content">
            Site
          </h4>
          <ul class="space-y-1 text-sm opacity-80">
            <li>
              <router-link to="/" class="hover:text-primary hover:underline transition-colors flex items-center gap-2">
                
                Home
              </router-link>
            </li>
            <li>
              <router-link to="/books" class="hover:text-primary hover:underline transition-colors flex items-center gap-2">
                
                Books
              </router-link>
            </li>
            <li>
              <router-link to="/authors" class="hover:text-primary hover:underline transition-colors flex items-center gap-2">
                
                Authors
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-primary hover:underline transition-colors flex items-center gap-2">
                
                About
              </router-link>
            </li>
          </ul>
        </div>
      </div>

      <div class="text-sm">
        <h4 class="font-medium mb-2 text-base-content">
          Connect
        </h4>
        <div class="flex gap-3">
          <a 
            aria-label="Github" 
            href="#" 
            class="btn btn-ghost btn-sm hover:bg-base-200 gap-2"
          >
            <i class="fab fa-github text-lg text-base-content"></i>
            Github
          </a>
          <a 
            aria-label="Twitter" 
            href="#" 
            class="btn btn-ghost btn-sm hover:bg-base-200 gap-2"
          >
            <i class="fab fa-twitter text-lg text-info"></i>
            Twitter
          </a>
        </div>
        <p class="mt-4 text-xs opacity-60 flex items-center gap-2">
          <i class="far fa-copyright text-primary"></i>
          {{ year }} Books & Authors. All rights reserved.
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