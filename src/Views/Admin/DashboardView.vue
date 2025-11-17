<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue'
import EmptyState from '@/components/Ui/EmptyState.vue'
import axios from 'axios'

const router = useRouter()

const books = ref([])
const authors = ref([])
const booksCount = ref(0)
const authorsCount = ref(0)
const topAuthor = ref(null)
const topTag = ref('-')
const latestBooks = ref([])
const loading = ref(true)
const error = ref(null)

const getAuthorName = (id) => authors.value.find(a => a.id == id)?.name || '-'

const fetchDashboardData = async () => {
  loading.value = true
  error.value = null
  
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
  } catch (err) {
    console.error('Error fetching dashboard data:', err)
    error.value = 'Failed to load dashboard data. Please try again.'
  } finally {
    loading.value = false
  }
}

const retryFetch = () => {
  fetchDashboardData()
}

const goToBooks = () => {
  router.push('/admin/books')
}

onMounted(fetchDashboardData)
</script>

<template>
  <!-- Page Header -->
  <div class="mb-8">
    <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-8 shadow-xl">
      <div class="relative z-10">
        <h1 class="text-4xl sm:text-3xl font-bold text-primary-content mb-2 drop-shadow-lg">
          <i class="fas fa-chart-line mr-3 text-accent"></i>Dashboard Overview
        </h1>
        <p class="text-primary-content/90 text-lg sm:text-sm">Welcome back! Here's what's happening with your library</p>
      </div>
      <div class="absolute top-0 right-0 w-64 h-64 sm:w-40 sm:h-40 bg-base-100 opacity-10 rounded-full -mr-32 -mt-32"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 sm:w-32 sm:h-32 bg-base-100 opacity-10 rounded-full -ml-24 -mb-24"></div>
    </div>
  </div>

  <!-- Loading State -->
  <LoadingSpinner 
    v-if="loading"
    message="Loading dashboard..."
    subtext="Gathering your library statistics"
    size="lg"
  />

  <!-- Error State -->
  <EmptyState
    v-else-if="error"
    icon="fas fa-exclamation-circle"
    icon-color="error"
    title="Failed to Load Dashboard"
    :description="error"
    action-text="Retry"
    action-icon="fas fa-redo"
    action-button-class="btn-error"
    :show-default-action="true"
    @action="retryFetch"
  />

  <!-- Dashboard Content -->
  <div v-else>
    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <!-- Total Books -->
      <div class="group card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 transform hover:-translate-y-1">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-primary-focus rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <i class="fas fa-book text-2xl sm:text-xl text-primary-content"></i>
            </div>
            <span class="badge badge-primary">Total</span>
          </div>
          <p class="text-4xl sm:text-3xl font-bold text-base-content mb-1">{{ booksCount }}</p>
          <p class="text-base-content/70 text-sm font-medium">Books in Library</p>
        </div>
      </div>

      <!-- Total Authors -->
      <div class="group card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 transform hover:-translate-y-1">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-secondary to-secondary-focus rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <i class="fas fa-pen-fancy text-2xl sm:text-xl text-secondary-content"></i>
            </div>
            <span class="badge badge-secondary">Total</span>
          </div>
          <p class="text-4xl sm:text-3xl font-bold text-base-content mb-1">{{ authorsCount }}</p>
          <p class="text-base-content/70 text-sm font-medium">Active Authors</p>
        </div>
      </div>

      <!-- Top Author -->
      <div class="group card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 transform hover:-translate-y-1">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-accent to-accent-content rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <i class="fas fa-trophy text-2xl sm:text-xl text-accent-content"></i>
            </div>
            <span class="badge badge-accent">Top</span>
          </div>
          <p class="text-xl sm:text-lg font-bold text-base-content mb-1 truncate">
            {{ topAuthor?.name || 'N/A' }}
          </p>
          <p class="text-base-content/70 text-sm font-medium">Most Productive Author</p>
        </div>
      </div>

      <!-- Top Tag -->
      <div class="group card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 transform hover:-translate-y-1">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <div class="w-14 h-14 sm:w-12 sm:h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform">
              <i class="fas fa-tags text-2xl sm:text-xl text-primary-content"></i>
            </div>
            <span class="badge badge-outline">Popular</span>
          </div>
          <p class="text-xl sm:text-lg font-bold text-base-content mb-1 truncate">
            {{ topTag || 'N/A' }}
          </p>
          <p class="text-base-content/70 text-sm font-medium">Most Used Tag</p>
        </div>
      </div>
    </div>

    <!-- Recent Books -->
    <div class="card bg-base-100 shadow-lg border border-base-300 overflow-x-auto">
      <div class="card-body">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 class="text-2xl sm:text-xl font-bold text-base-content mb-1">
              <i class="fas fa-book-open mr-2"></i>Recently Added Books
            </h2>
            <p class="text-base-content/70 text-sm">Latest additions to your library</p>
          </div>
          <router-link
            to="/admin/books"
            class="btn btn-primary btn-sm"
          >
            View All <i class="fas fa-arrow-right ml-1"></i>
          </router-link>
        </div>

        <!-- Empty State for no books -->
        <EmptyState
          v-if="latestBooks.length === 0"
          icon="fas fa-book-open"
          icon-color="info"
          title="No Books Added Yet"
          description="Start building your library by adding your first book"
          action-text="Add Book"
          action-icon="fas fa-plus"
          action-button-class="btn-primary"
          :show-default-action="true"
          @action="goToBooks"
          size="sm"
        />

        <!-- Books Table -->
        <div v-else class="overflow-x-auto">
          <table class="table table-zebra w-full">
            <thead>
              <tr>
                <th class="bg-base-200">Cover</th>
                <th class="bg-base-200">Title</th>
                <th class="bg-base-200">Author</th>
                <th class="bg-base-200">Year</th>
                <th class="bg-base-200">Tags</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="book in latestBooks"
                :key="book.id"
                class="hover"
              >
                <td>
                  <div class="avatar">
                    <div class="w-12 h-16 rounded-lg">
                      <img
                        :src="book.coverUrl"
                        :alt="book.title"
                        class="object-cover"
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <p class="font-semibold text-base-content text-sm">{{ book.title }}</p>
                </td>
                <td>
                  <p class="text-base-content/80 text-sm">{{ getAuthorName(book.authorId) }}</p>
                </td>
                <td>
                  <p class="text-base-content/80 text-sm">{{ book.year }}</p>
                </td>
                <td>
                  <div class="flex flex-wrap gap-1">
                    <span
                      v-for="(tag, idx) in (book.tags || []).slice(0, 2)"
                      :key="idx"
                      class="badge badge-primary badge-sm"
                    >
                      {{ tag }}
                    </span>
                    <span
                      v-if="book.tags && book.tags.length > 2"
                      class="badge badge-ghost badge-sm"
                    >
                      +{{ book.tags.length - 2 }}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>