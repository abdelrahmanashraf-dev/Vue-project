import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = 'http://localhost:3000/books'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    selectedBook: null,
    loading: false,
    error: null
  }),

  actions: {
    async fetchBooks() {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(BASE_URL)
        this.books = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchBookById(id) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.get(`${BASE_URL}/${id}`)
        this.selectedBook = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addBook(newBook) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.post(BASE_URL, newBook)
        this.books.push(res.data)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async updateBook(id, updatedData) {
      this.loading = true
      this.error = null
      try {
        const res = await axios.put(`${BASE_URL}/${id}`, updatedData)
        const index = this.books.findIndex(b => b.id === id)
        if (index !== -1) this.books[index] = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async deleteBook(id) {
      this.loading = true
      this.error = null
      try {
        await axios.delete(`${BASE_URL}/${id}`)
        this.books = this.books.filter(b => b.id !== id)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    }
  }
})
