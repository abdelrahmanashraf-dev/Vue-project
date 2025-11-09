<template>
  <div class="flex min-h-screen bg-base-200">
    <!-- Sidebar -->
    <aside class="w-64 bg-base-100 border-r border-gray-200 p-4 hidden md:block">
      <h2 class="text-2xl font-bold mb-6">Admin Panel</h2>
      <ul class="menu">
        <li><router-link to="/admin" class="hover:bg-primary/10">Dashboard</router-link></li>
        <li><router-link to="/admin/books" class="hover:bg-primary/10">Books</router-link></li>
        <li><router-link to="/admin/authors" class="hover:bg-primary/10">Authors</router-link></li>
      </ul>
    </aside>

    <!-- Main content -->
    <main class="flex-1 p-6">


      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="card shadow-md bg-base-100 p-4">
          <div class="card-body text-center">
            <h2 class="card-title">Total Books</h2>
            <p class="text-3xl font-bold">{{ booksCount }}</p>
          </div>
        </div>
        <div class="card shadow-md bg-base-100 p-4">
          <div class="card-body text-center">
            <h2 class="card-title">Total Authors</h2>
            <p class="text-3xl font-bold">{{ authorsCount }}</p>
          </div>
        </div>
        <div class="card shadow-md bg-base-100 p-4">
          <div class="card-body text-center">
            <h2 class="card-title">Top Author</h2>
            <p class="text-lg font-semibold">{{ topAuthor?.name || 'Loading...' }}</p>
          </div>
        </div>
        <div class="card shadow-md bg-base-100 p-4">
          <div class="card-body text-center">
            <h2 class="card-title">Top Tag</h2>
            <p class="text-lg font-semibold">{{ topTag || 'Loading...' }}</p>
          </div>
        </div>
      </div>

      <!-- Recent Books -->
      <div class="card bg-base-100 shadow-md">
        <div class="card-body">
          <h2 class="text-xl font-semibold mb-4">Recently Added Books</h2>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in latestBooks" :key="book.id">
                  <td><img :src="book.coverUrl" class="w-16 h-20 object-cover rounded"></td>
                  <td>{{ book.title }}</td>
                  <td>{{ getAuthorName(book.authorId) }}</td>
                  <td>{{ book.year }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const books = ref([])
const authors = ref([])
const booksCount = ref(0)
const authorsCount = ref(0)
const topAuthor = ref(null)
const topTag = ref('')
const latestBooks = ref([])

const getAuthorName = (id) => authors.value.find(a => a.id === id)?.name || '-'

const fetchDashboardData = async () => {
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
  const topId = Object.entries(authorCount).sort((a,b)=>b[1]-a[1])[0]?.[0]
  topAuthor.value = authors.value.find(a => a.id == topId)

  // Top tag
  const tagCount = {}
  books.value.forEach(b => b.tags.forEach(tag => tagCount[tag]=(tagCount[tag]||0)+1))
  topTag.value = Object.entries(tagCount).sort((a,b)=>b[1]-a[1])[0]?.[0] || '-'

  // Latest 5 books
  latestBooks.value = books.value.slice(-5).reverse()
}

onMounted(fetchDashboardData)
</script>
