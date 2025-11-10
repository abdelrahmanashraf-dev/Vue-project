// stores/useAuthStore.js
import { defineStore } from 'pinia'

const STATIC_CREDENTIALS = {
  email: 'abdelrahman@gmail.com',
  password: 'Abdelrahman@123',
  name: 'Abdelrahman Ashraf'
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    currentUser: (state) => state.user
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))

        // Check credentials
        if (email === STATIC_CREDENTIALS.email && password === STATIC_CREDENTIALS.password) {
          const userData = {
            email: STATIC_CREDENTIALS.email,
            name: STATIC_CREDENTIALS.name,
            avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=6366f1&color=fff&size=128'
          }
          
          this.user = userData
          
          // Save to localStorage for persistence
          localStorage.setItem('auth_user', JSON.stringify(userData))
          
          return { success: true }
        } else {
          throw new Error('Invalid email or password')
        }
      } catch (err) {
        this.error = err.message
        return { success: false, error: err.message }
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      localStorage.removeItem('auth_user')
    },

    checkAuth() {
      // Check if user is logged in from localStorage
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        try {
          this.user = JSON.parse(savedUser)
        } catch (e) {
          localStorage.removeItem('auth_user')
        }
      }
    }
  }
})