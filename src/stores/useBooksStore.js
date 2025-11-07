import { defineStore } from 'pinia'
import axios from 'axios'

export const useBooksStore = defineStore('books', {
  state: () => ({
    books: [],
    loading: false,
    error: null
  }),

  actions: {
    async fetchBooks() {
      this.loading = true
      try {
        const res = await axios.get('http://localhost:3000/books')
        this.books = res.data
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async addBook(newBook) {
      const res = await axios.post('http://localhost:3000/books', newBook)
      this.books.push(res.data)
    },

    async updateBook(id, updatedData) {
      const res = await axios.put(`http://localhost:3000/books/${id}`, updatedData)
      const index = this.books.findIndex(b => b.id === id)
      if (index !== -1) this.books[index] = res.data
    },

    async deleteBook(id) {
      await axios.delete(`http://localhost:3000/books/${id}`)
      this.books = this.books.filter(b => b.id !== id)
    }
  }
})
