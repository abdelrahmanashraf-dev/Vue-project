<template>
  <div data-theme="papyrus" class="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
    
    <!-- Loading State (عند التحقق من الجلسة الحالية) -->
    <div v-if="checkingAuth" class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <LoadingSpinner 
          message="Checking authentication..."
          subtext="Please wait"
          size="md"
          color="primary"
        />
      </div>
    </div>

    <!-- Login Form -->
    <div v-else class="card w-full max-w-md bg-base-100 shadow-2xl">
      <div class="card-body">
        <!-- Header -->
        <div class="text-center mb-6">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mb-4 shadow-lg">
            <i class="fas fa-shield-alt text-3xl text-primary-content"></i>
          </div>
          <h2 class="text-3xl font-bold text-base-content">Admin Login</h2>
          <p class="text-base-content/60 mt-2">Books & Authors Management</p>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-error mb-4 shadow-md">
          <i class="fas fa-exclamation-circle text-xl"></i>
          <span>{{ error }}</span>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">
                <i class="fas fa-envelope text-primary mr-2"></i>Email
              </span>
            </label>
            <input
              type="email"
              v-model="formData.email"
              placeholder="admin@example.com"
              class="input input-bordered w-full"
              :class="{ 'input-error': emailError }"
              required
              :disabled="loading"
              @blur="validateEmail"
              @input="emailError = ''"
            />
            <label v-if="emailError" class="label">
              <span class="label-text-alt text-error">{{ emailError }}</span>
            </label>
          </div>

          <div class="form-control">
            <label class="label">
              <span class="label-text font-semibold">
                <i class="fas fa-lock text-secondary mr-2"></i>Password
              </span>
            </label>
            <div class="relative">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="formData.password"
                placeholder="••••••••"
                class="input input-bordered w-full pr-12"
                :class="{ 'input-error': passwordError }"
                required
                :disabled="loading"
                @blur="validatePassword"
                @input="passwordError = ''"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
                :disabled="loading"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <label v-if="passwordError" class="label">
              <span class="label-text-alt text-error">{{ passwordError }}</span>
            </label>
          </div>

          <!-- Remember Me -->
          <div class="form-control">
            <label class="label cursor-pointer justify-start gap-3">
              <input 
                type="checkbox" 
                v-model="rememberMe" 
                class="checkbox checkbox-primary checkbox-sm"
                :disabled="loading"
              />
              <span class="label-text">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full shadow-md"
            :disabled="loading || !isFormValid"
          >
            <span v-if="loading" class="loading loading-spinner loading-sm"></span>
            <i v-else class="fas fa-sign-in-alt mr-2"></i>
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>

        <!-- Back to Home -->
        <div class="text-center mt-6">
          <router-link 
            to="/" 
            class="link link-primary inline-flex items-center gap-2 hover:gap-3 transition-all"
          >
            <i class="fas fa-arrow-left"></i>
            <span>Back to Home</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/useAuthStore'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const { showToast } = useToast()

const formData = ref({
  email: '',
  password: ''
})

const loading = ref(false)
const checkingAuth = ref(true)
const error = ref(null)
const emailError = ref('')
const passwordError = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)

// Check if user is already logged in
onMounted(async () => {
  checkingAuth.value = true
  
  // Simulate checking authentication
  await new Promise(resolve => setTimeout(resolve, 500))
  
  if (authStore.isAuthenticated) {
    showToast('Already logged in. Redirecting...', 'info')
    router.push('/admin')
  }
  
  checkingAuth.value = false
})

// Validation
const validateEmail = () => {
  const email = formData.value.email.trim()
  
  if (!email) {
    emailError.value = 'Email is required'
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }
  
  emailError.value = ''
  return true
}

const validatePassword = () => {
  const password = formData.value.password
  
  if (!password) {
    passwordError.value = 'Password is required'
    return false
  }
  
  if (password.length < 6) {
    passwordError.value = 'Password must be at least 6 characters'
    return false
  }
  
  passwordError.value = ''
  return true
}

const isFormValid = computed(() => {
  return formData.value.email && 
         formData.value.password && 
         !emailError.value && 
         !passwordError.value
})

const handleLogin = async () => {
  // Validate both fields
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  
  if (!isEmailValid || !isPasswordValid) {
    showToast('Please fix the errors before submitting', 'error')
    return
  }
  
  loading.value = true
  error.value = null

  try {
    const result = await authStore.login(
      formData.value.email, 
      formData.value.password,
      rememberMe.value
    )

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
  } catch (err) {
    error.value = 'An unexpected error occurred. Please try again.'
    showToast('Login failed. Please try again.', 'error')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Add smooth transitions */
.link {
  transition: gap 0.2s ease;
}

/* Pulse animation for loading spinner */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>