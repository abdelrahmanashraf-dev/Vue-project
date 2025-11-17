<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue'
import EmptyState from '@/components/Ui/EmptyState.vue'
import axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Doughnut, Line } from 'vue-chartjs'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

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

// Chart Data
const booksByYearData = computed(() => {
  const yearCount = {}
  books.value.forEach(book => {
    yearCount[book.year] = (yearCount[book.year] || 0) + 1
  })
  
  const sortedYears = Object.keys(yearCount).sort()
  
  return {
    labels: sortedYears,
    datasets: [{
      label: 'Books Published',
      data: sortedYears.map(year => yearCount[year]),
      backgroundColor: 'rgba(212, 175, 55, 0.8)',
      borderColor: 'rgba(212, 175, 55, 1)',
      borderWidth: 2
    }]
  }
})

const booksByAuthorData = computed(() => {
  const authorCount = {}
  books.value.forEach(book => {
    const authorName = getAuthorName(book.authorId)
    authorCount[authorName] = (authorCount[authorName] || 0) + 1
  })
  
  const sortedAuthors = Object.entries(authorCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
  
  return {
    labels: sortedAuthors.map(([name]) => name),
    datasets: [{
      label: 'Books by Author',
      data: sortedAuthors.map(([, count]) => count),
      backgroundColor: [
        'rgba(212, 175, 55, 0.8)',
        'rgba(191, 167, 111, 0.8)',
        'rgba(161, 128, 45, 0.8)',
        'rgba(212, 175, 55, 0.6)',
        'rgba(191, 167, 111, 0.6)',
        'rgba(161, 128, 45, 0.6)'
      ],
      borderColor: [
        'rgba(212, 175, 55, 1)',
        'rgba(191, 167, 111, 1)',
        'rgba(161, 128, 45, 1)',
        'rgba(212, 175, 55, 1)',
        'rgba(191, 167, 111, 1)',
        'rgba(161, 128, 45, 1)'
      ],
      borderWidth: 2
    }]
  }
})

const topTagsData = computed(() => {
  const tagCount = {}
  books.value.forEach(book => {
    if (book.tags && Array.isArray(book.tags)) {
      book.tags.forEach(tag => {
        tagCount[tag] = (tagCount[tag] || 0) + 1
      })
    }
  })
  
  const sortedTags = Object.entries(tagCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
  
  return {
    labels: sortedTags.map(([tag]) => tag),
    datasets: [{
      label: 'Books with Tag',
      data: sortedTags.map(([, count]) => count),
      backgroundColor: 'rgba(191, 167, 111, 0.8)',
      borderColor: 'rgba(191, 167, 111, 1)',
      borderWidth: 2
    }]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top',
      labels: {
        color: '#3a3a3a',
        font: {
          family: 'ui-sans-serif, system-ui, sans-serif',
          size: 12
        }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(212, 175, 55, 1)',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#3a3a3a',
        stepSize: 1
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    },
    x: {
      ticks: {
        color: '#3a3a3a'
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  }
}

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        color: '#3a3a3a',
        font: {
          family: 'ui-sans-serif, system-ui, sans-serif',
          size: 11
        },
        padding: 15
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(212, 175, 55, 1)',
      borderWidth: 1
    }
  }
}

const horizontalBarOptions = {
  indexAxis: 'y',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: 'rgba(212, 175, 55, 1)',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      ticks: {
        color: '#3a3a3a'
      },
      grid: {
        display: false
      }
    },
    x: {
      beginAtZero: true,
      ticks: {
        color: '#3a3a3a',
        stepSize: 1
      },
      grid: {
        color: 'rgba(0, 0, 0, 0.05)'
      }
    }
  }
}

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

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Books by Year Chart -->
      <div class="card bg-base-100 shadow-lg border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-lg mb-4 text-base-content">
            <i class="fas fa-chart-bar text-primary mr-2"></i>
            Books by Publication Year
          </h3>
          <div class="h-64">
            <Bar :data="booksByYearData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- Books by Author Chart -->
      <div class="card bg-base-100 shadow-lg border border-base-300">
        <div class="card-body">
          <h3 class="card-title text-lg mb-4 text-base-content">
            <i class="fas fa-chart-pie text-secondary mr-2"></i>
            Books by Author (Top 6)
          </h3>
          <div class="h-64">
            <Doughnut :data="booksByAuthorData" :options="doughnutOptions" />
          </div>
        </div>
      </div>

      <!-- Top Tags Chart -->
      <div class="card bg-base-100 shadow-lg border border-base-300 lg:col-span-2">
        <div class="card-body">
          <h3 class="card-title text-lg mb-4 text-base-content">
            <i class="fas fa-tags text-accent mr-2"></i>
            Most Popular Tags (Top 8)
          </h3>
          <div class="h-64">
            <Bar :data="topTagsData" :options="horizontalBarOptions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Books -->
    <div class="card bg-base-100 shadow-lg border border-base-300 overflow-x-auto">
      <div class="card-body">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 class="text-2xl sm:text-xl font-bold text-base-content mb-1">
              <i class="fas fa-book-open mr-2 text-primary"></i>Recently Added Books
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