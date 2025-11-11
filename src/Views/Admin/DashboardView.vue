<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])
const authors = ref([])
const booksCount = ref(0)
const authorsCount = ref(0)
const topAuthor = ref(null)
const topTag = ref('-')
const latestBooks = ref([])
const loading = ref(true)


const getAuthorName = (id) => authors.value.find(a => a.id == id)?.name || '-'

const fetchDashboardData = async () => {
  loading.value = true
  try {
    const [booksRes, authorsRes] = await Promise.all([
      axios.get('http://localhost:3000/books'),
      axios.get('http://localhost:3000/authors')
    ])

    books.value = booksRes.data
    authors.value = authorsRes.data

    booksCount.value = books.value.length
    authorsCount.value = authors.value.length

    // Top author
    const authorCount = {}
    books.value.forEach(b => {
      authorCount[b.authorId] = (authorCount[b.authorId] || 0) + 1
    })
    const topId = Object.entries(authorCount).sort((a, b) => b[1] - a[1])[0]?.[0]
    topAuthor.value = authors.value.find(a => a.id == topId)

    // Top tag
    const tagCount = {}
    books.value.forEach(b => {
      if (b.tags && Array.isArray(b.tags)) {
        b.tags.forEach(tag => tagCount[tag] = (tagCount[tag] || 0) + 1)
      }
    })
    topTag.value = Object.entries(tagCount).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'

    // Latest 5 books
    latestBooks.value = books.value.slice(-5).reverse()
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboardData)
</script>

<template>
  <!-- Page Header -->
  <div class="mb-8">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 shadow-xl">
      <div class="relative z-10">
        <h1 class="text-4xl sm:text-3xl font-bold text-white mb-2 drop-shadow-lg">📊 Dashboard Overview</h1>
        <p class="text-indigo-100 text-lg sm:text-sm">Welcome back! Here's what's happening with your library</p>
      </div>
      <div class="absolute top-0 right-0 w-64 h-64 sm:w-40 sm:h-40 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 sm:w-32 sm:h-32 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
    </div>
  </div>

  <!-- Loading State -->
  <div v-if="loading" class="flex justify-center items-center py-20">
    <div class="relative">
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
      <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent absolute top-0 left-0"></div>
    </div>
  </div>

  <div v-else>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Books -->
      <div class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span class="text-2xl sm:text-xl">📚</span>
          </div>
          <span class="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-full">
            Total
          </span>
        </div>
        <p class="text-4xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ booksCount }}</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Books in Library</p>
      </div>

      <!-- Total Authors -->
      <div class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span class="text-2xl sm:text-xl">✍️</span>
          </div>
          <span class="text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1 rounded-full">
            Total
          </span>
        </div>
        <p class="text-4xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">{{ authorsCount }}</p>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Authors</p>
      </div>

      <!-- Top Author -->
      <div class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span class="text-2xl sm:text-xl">🏆</span>
          </div>
          <span class="text-sm font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
            Top
          </span>
        </div>
        <p class="text-xl sm:text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          {{ topAuthor?.name || 'N/A' }}
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Most Productive Author</p>
      </div>

      <!-- Top Tag -->
      <div class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1">
        <div class="flex items-center justify-between mb-4">
          <div class="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
            <span class="text-2xl sm:text-xl">🏷️</span>
          </div>
          <span class="text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-3 py-1 rounded-full">
            Popular
          </span>
        </div>
        <p class="text-xl sm:text-lg font-bold text-gray-900 dark:text-white mb-1 truncate">
          {{ topTag || 'N/A' }}
        </p>
        <p class="text-gray-500 dark:text-gray-400 text-sm font-medium">Most Used Tag</p>
      </div>
    </div>

    <!-- Recent Books -->
    <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
      <div class="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 class="text-2xl sm:text-xl font-bold text-gray-900 dark:text-white mb-1">📖 Recently Added Books</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Latest additions to your library</p>
        </div>
        <router-link
          to="/admin/books"
          class="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all font-semibold text-sm"
        >
          View All →
        </router-link>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead class="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Cover</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Title</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Author</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Year</th>
              <th class="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Tags</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr
              v-for="book in latestBooks"
              :key="book.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td class="px-4 sm:px-6 py-2">
                <img
                  :src="book.coverUrl"
                  :alt="book.title"
                  class="w-12 sm:w-10 h-16 sm:h-14 object-cover rounded-lg shadow-sm"
                />
              </td>
              <td class="px-4 sm:px-6 py-2">
                <p class="font-semibold text-gray-900 dark:text-white text-sm sm:text-xs">{{ book.title }}</p>
              </td>
              <td class="px-4 sm:px-6 py-2">
                <p class="text-gray-700 dark:text-gray-300 text-sm sm:text-xs">{{ getAuthorName(book.authorId) }}</p>
              </td>
              <td class="px-4 sm:px-6 py-2">
                <p class="text-gray-700 dark:text-gray-300 text-sm sm:text-xs">{{ book.year }}</p>
              </td>
              <td class="px-4 sm:px-6 py-2">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="(tag, idx) in (book.tags || []).slice(0, 2)"
                    :key="idx"
                    class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs rounded-full font-semibold"
                  >
                    {{ tag }}
                  </span>
                  <span
                    v-if="book.tags && book.tags.length > 2"
                    class="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full font-semibold"
                  >
                    +{{ book.tags.length - 2 }}
                  </span>
                </div>
              </td>
            </tr>
            <tr v-if="latestBooks.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="text-gray-400 dark:text-gray-500">
                  <span class="text-4xl mb-2 block">📚</span>
                  <p class="text-sm">No books added yet</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
