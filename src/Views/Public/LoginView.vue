<template>
  <div data-theme="papyrus" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
    <div class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-primary-content" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
            </svg>
          </div>
          <h2 class="text-3xl font-bold text-base-content">Admin Login</h2>
          <p class="text-base-content/60 mt-2">Books & Authors Management</p>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Email</span>
            </label>
            <input
              type="email"
              v-model="formData.email"
              placeholder="admin@example.com"
              class="input input-bordered w-full"
              required
              :disabled="loading"
            />
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">Password</span>
            </label>
            <input
              type="password"
              v-model="formData.password"
              placeholder="••••••••"
              class="input input-bordered w-full"
              required
              :disabled="loading"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="loading"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <!-- Back to Home -->
        <div class="text-center mt-4">
          <router-link to="/" class="link link-primary">
            <svg xmlns="http://www.w3.org/2000/svg" class="inline w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showToast } = useToast()

const formData = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null

  const result = await authStore.login(formData.value.email, formData.value.password)

  if (result.success) {
    showToast('Welcome back! Login successful', 'success', 3000)
    
    const redirect = route.query.redirect || '/admin'
    
    setTimeout(() => {
      router.push(redirect)
    }, 500)
  } else {
    error.value = result.error
    showToast(result.error, 'error', 4000)
  }

  loading.value = false
}
</script>