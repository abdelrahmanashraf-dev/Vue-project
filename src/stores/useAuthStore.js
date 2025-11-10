
import { defineStore } from 'pinia'


const USERS = [
  {
    email: 'abdelrahman@gmail.com',
    password: 'Abdelrahman@123',
    name: 'Abdelrahman Ashraf'
  },
  {
   email: 'es.mostafa180@gmail.com',
    password: 'es123456',
    name: 'Esraa Mostafa'
  },
    {
    email: '...@gmail.com',
    password: '....',
    name: 'Jehan Usama'
  },
    {
    email: '....@gmail.com',
    password: '....',
    name: 'Hassan Ahmed'
  }
]

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

        await new Promise(resolve => setTimeout(resolve, 800))

        const user = USERS.find(
          u => u.email === email && u.password === password
        )

        if (user) {
          const userData = {
            email: user.email,
            name: user.name,
            avatar: `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff&size=128`
          }
          
          this.user = userData
  
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
