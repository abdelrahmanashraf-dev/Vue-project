import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'http://localhost:3000/authors'

export const useAuthorsStore = defineStore('authors', {
  state: () => ({
    authors: [],
    selectedAuthor: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchAuthors() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(BASE_URL)
        this.authors = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchAuthorById(id) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/${id}`)
        this.selectedAuthor = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addAuthor(newAuthor) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post(BASE_URL, newAuthor)
        this.authors.push(res.data)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async updateAuthor(id, updatedData) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.put(`${BASE_URL}/${id}`, updatedData)
        const index = this.authors.findIndex(a => a.id === id)
        if (index !== -1) this.authors[index] = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async deleteAuthor(id) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${BASE_URL}/${id}`)
        this.authors = this.authors.filter(a => a.id !== id)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})