<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue'
import EmptyState from '@/components/Ui/EmptyState.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const author = ref({})
const relatedAuthors = ref([])
const authorBooks = ref([]) 

const isDark = ref(true)
const loading = ref(true)
const error = ref(null)

// Theme
const updateTheme = () => {
  const saved = document.documentElement.getAttribute('data-theme')
  isDark.value = saved === 'dark'
}

// Navigate
const goToAuthor = (id) => {
  if (route.params.id != id) {
    router.replace({ name: 'author-details', params: { id } })
  }
}

const goToBook = (id) => {
  router.push({ name: 'book-details', params: { id } })
}

const goBack = () => {
  router.push('/authors')
}

// Shuffle helper
const shuffleArray = (array) => array.sort(() => 0.5 - Math.random())

// Fetch author + related + top 2 books
const fetchData = async (authorId) => {
  loading.value = true
  error.value = null
  author.value = {}
  relatedAuthors.value = []
  authorBooks.value = []

  try {
    // Author
    const resAuthor = await axios.get(`http://localhost:3000/authors/${authorId}`)
    author.value = resAuthor.data

    // Author books
    const resBooks = await axios.get(`http://localhost:3000/books?authorId=${authorId}`)
    authorBooks.value = resBooks.data.slice(0, 2) 

    // Related authors
    const resOtherAuthors = await axios.get(`http://localhost:3000/authors`)
    let otherAuthors = resOtherAuthors.data
      .filter(a => a.id != authorId)
      .map(a => ({ ...a }))

    // Shuffle and pick first 6
    relatedAuthors.value = shuffleArray(otherAuthors).slice(0, 6)
  } catch (err) {
    console.error(err)
    error.value = err.response?.status === 404 
      ? 'Author not found' 
      : 'Failed to load author details. Please try again.'
  } finally {
    loading.value = false
  }
}

// Theme observer
const themeObserver = () => {
  const observer = new MutationObserver(updateTheme)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}

onMounted(() => {
  if (!document.documentElement.getAttribute('data-theme'))
    document.documentElement.setAttribute('data-theme', 'dark')

  updateTheme()
  fetchData(route.params.id)
  themeObserver()
})

watch(() => route.params.id, (newId) => fetchData(newId))
</script>

<template>
<div :key="route.fullPath" class="min-h-screen font-sans" :class="isDark ? 'bg-base-100 text-base-content' : 'bg-base-100 text-base-content'">

  <!-- Loading -->
  <LoadingSpinner 
    v-if="loading"
    message="Loading author details..."
    subtext="Gathering information about this writer"
    size="lg"
    container-class="min-h-screen"
  />

  <!-- Error/Not Found State -->
  <EmptyState
    v-else-if="error"
    :icon="error === 'Author not found' ? 'fas fa-user-slash' : 'fas fa-exclamation-triangle'"
    :icon-color="error === 'Author not found' ? 'warning' : 'error'"
    :title="error === 'Author not found' ? 'Author Not Found' : 'Something Went Wrong'"
    :description="error === 'Author not found' 
      ? 'The author you\'re looking for doesn\'t exist or has been removed' 
      : error"
    action-text="Back to Authors"
    action-icon="fas fa-arrow-left"
    action-button-class="btn-secondary"
    :show-default-action="true"
    @action="goBack"
    container-class="min-h-screen"
  />

  <!-- Author Details -->
  <section v-else class="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div :class="isDark ? 'bg-base-100 text-base-content border-gray-700' : 'bg-base-100 text-base-content border-gray-200'" 
         class="flex flex-col lg:flex-row shadow-xl rounded-2xl overflow-hidden border"> 

      <!-- Author Avatar -->
      <figure class="w-full lg:w-1/3 bg-base-200 h-64 sm:h-80 lg:h-auto lg:min-h-[400px]">
        <img :src="author.avatarUrl" alt="Author photo"
             class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"/>
      </figure>

      <!-- Author Info -->
      <div class="p-4 sm:p-6 lg:w-2/3 flex flex-col justify-between">
        <div>
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-primary">{{ author.name }}</h2>
          <p class="leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">{{ author.bio }}</p>

          <!-- Author Books Section -->
          <div v-if="authorBooks.length > 0">
            <h3 class="font-semibold mb-2 text-secondary text-sm sm:text-base">
              <i class="fas fa-book mr-2 text-primary"></i>Top Works:
            </h3>
            <ul class="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li v-for="book in authorBooks" :key="book.id" 
                  class="cursor-pointer hover:text-primary flex items-center gap-2 transition-colors" 
                  @click="goToBook(book.id)">
                <i class="fas fa-book-open text-xs text-secondary"></i>
                <span>{{ book.title }} ({{ book.year }})</span>
              </li>
            </ul>
          </div>

          <!-- No Books Message -->
          <div v-else class="alert alert-info shadow-sm">
            <i class="fas fa-info-circle"></i>
            <span class="text-xs sm:text-sm">No books available for this author yet</span>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
          <router-link to="/authors"
                       class="border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
            <i class="fas fa-arrow-left"></i> 
            <span>Back to Authors</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Related Authors -->
  <section v-if="!loading && !error && relatedAuthors.length" class="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary">
      <i class="fas fa-users mr-2 text-accent"></i>Other Authors
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      <div v-for="other in relatedAuthors" :key="other.id"
           class="cursor-pointer card shadow-lg rounded-xl hover:scale-105 transition-transform bg-base-100 flex flex-col overflow-hidden h-48 sm:h-52 lg:h-56"
           @click="goToAuthor(other.id)">

        <figure class="h-[55%] w-full overflow-hidden flex-shrink-0">
          <img :src="other.avatarUrl" alt="Author" class="object-cover w-full h-full"/>
        </figure>

        <div class="p-1 sm:p-2 h-[45%] flex flex-col justify-center text-center overflow-hidden">
          <h3 class="font-semibold text-xs sm:text-sm truncate mb-1">{{ other.name }}</h3>
          <ul v-if="other.topBooks" class="text-[10px] sm:text-xs text-secondary space-y-0.5 sm:space-y-1 mt-1">
            <li v-for="book in other.topBooks" :key="book.id" 
                class="truncate cursor-pointer hover:text-primary flex items-center justify-center gap-1 transition-colors" 
                @click.stop="goToBook(book.id)">
              <i class="fas fa-book text-[8px] sm:text-[10px] text-primary"></i>
              <span>{{ book.title }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Empty Related Authors State -->
  <section v-if="!loading && !error && relatedAuthors.length === 0" class="container mx-auto px-6 py-12">
    <EmptyState
      icon="fas fa-users"
      icon-color="info"
      title="No Other Authors"
      description="This is the only author in our collection at the moment"
      size="sm"
    />
  </section>

</div>
</template>