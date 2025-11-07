import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthorsStore = defineStore('authors', {
  state: () => ({
    authors: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchAuthors() {
      this.loading = true
      try {
        const res = await axios.get('http://localhost:3000/authors')
        this.authors = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addAuthor(newAuthor) {
      const res = await axios.post('http://localhost:3000/authors', newAuthor)
      this.authors.push(res.data)
    },

    async updateAuthor(id, updatedData) {
      const res = await axios.put(`http://localhost:3000/authors/${id}`, updatedData)
      const index = this.authors.findIndex(a => a.id === id)
      if (index !== -1) this.authors[index] = res.data
    },

    async deleteAuthor(id) {
      await axios.delete(`http://localhost:3000/authors/${id}`)
      this.authors = this.authors.filter(a => a.id !== id)
    }
  }
})
