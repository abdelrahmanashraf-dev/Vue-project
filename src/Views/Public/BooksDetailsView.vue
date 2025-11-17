<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue'
import EmptyState from '@/components/Ui/EmptyState.vue'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const book = ref({})
const author = ref({})
const relatedBooks = ref([])

const isDark = ref(true)
const loading = ref(true)
const error = ref(null)

const updateTheme = () => {
  const saved = document.documentElement.getAttribute('data-theme')
  isDark.value = saved === 'dark'
}

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random())

const fetchData = async (id) => {
  loading.value = true
  error.value = null
  
  try {
    const resBook = await axios.get(`http://localhost:3000/books/${id}`)
    book.value = resBook.data

    if (book.value.authorId) {
      const resAuthor = await axios.get(`http://localhost:3000/authors/${book.value.authorId}`)
      author.value = resAuthor.data
    }

    const resAllBooks = await axios.get(`http://localhost:3000/books`)
    let allBooks = resAllBooks.data.filter(b => b.id !== id)

    let sameAuthorBooks = allBooks.filter(b => b.authorId === book.value.authorId)
    let otherBooks = allBooks.filter(b => b.authorId !== book.value.authorId)

    sameAuthorBooks = shuffleArray(sameAuthorBooks)
    otherBooks = shuffleArray(otherBooks)

    relatedBooks.value = [...sameAuthorBooks, ...otherBooks].slice(0, 6)
  } catch (err) {
    console.error(err)
    error.value = err.response?.status === 404 
      ? 'Book not found' 
      : 'Failed to load book details. Please try again.'
  } finally {
    loading.value = false
  }
}

const goToBook = (id) => {
  if (id !== route.params.id) router.push({ name: 'book-details', params: { id } })
}

const goToAuthor = (id) => {
  router.push({ name: 'author-details', params: { id } })
}

const goBack = () => {
  router.push('/books')
}

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

watch(() => route.params.id, fetchData)
</script>

<template>
<div :key="route.fullPath" 
     :class="isDark ? 'bg-base-100 text-base-content' : 'bg-base-100 text-base-content'"
     class="min-h-screen font-sans">

  
  <LoadingSpinner 
    v-if="loading"
    message="Loading book details..."
    subtext="Please wait while we gather information"
    size="lg"
    container-class="min-h-screen"
  />

  
  <EmptyState
    v-else-if="error"
    :icon="error === 'Book not found' ? 'fas fa-book-dead' : 'fas fa-exclamation-triangle'"
    :icon-color="error === 'Book not found' ? 'warning' : 'error'"
    :title="error === 'Book not found' ? 'Book Not Found' : 'Something Went Wrong'"
    :description="error === 'Book not found' 
      ? 'The book you\'re looking for doesn\'t exist or has been removed from our library' 
      : error"
    action-text="Back to Books"
    action-icon="fas fa-arrow-left"
    action-button-class="btn-primary"
    :show-default-action="true"
    @action="goBack"
    container-class="min-h-screen"
  />

  <!-- Book Details -->
  <section v-else class="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <div :class="isDark
          ? 'bg-base-100 text-base-content border-gray-700'
          : 'bg-base-100 text-base-content border-gray-200'"
         class="flex flex-col lg:flex-row shadow-xl rounded-2xl overflow-hidden border">

      <!-- Book Cover -->
      <figure class="w-full lg:w-1/3 bg-base-200 h-64 sm:h-80 lg:h-auto lg:min-h-[400px]">
        <img :src="book.coverUrl" alt="Book cover"
             class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"/>
      </figure>

      <!-- Book Info -->
      <div class="p-4 sm:p-6 lg:w-2/3 flex flex-col justify-between">
        <div>
          <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 text-primary">{{ book.title }}</h2>
          <p class="leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base line-clamp-4 sm:line-clamp-none">{{ book.description }}</p>

          <ul class="space-y-1 sm:space-y-2 text-xs sm:text-sm mb-4">
            <li>
              <span class="font-semibold text-secondary">
                <i class="fas fa-pen-fancy mr-1 text-primary"></i>Author:
              </span>
              <span v-if="author.name" 
                    class="ml-1 text-dark hover:text-primary cursor-pointer transition-colors duration-300" 
                    @click="goToAuthor(author.id)">
                {{ author.name }}
              </span>
            </li>
            <li>
              <span class="font-semibold text-secondary">
                <i class="fas fa-calendar-alt mr-1 text-secondary"></i>Published:
              </span> {{ book.year }}
            </li>
          </ul>
        </div>

        <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4">
          <button class="bg-primary hover:bg-primary-focus text-white shadow-md px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
            <i class="fas fa-heart text-accent"></i> 
            <span>Add to Wishlist</span>
          </button>
          <router-link to="/books" 
                       class="border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 text-sm sm:text-base">
            <i class="fas fa-arrow-left"></i> 
            <span>Back to Books</span>
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Related Books -->
  <section v-if="!loading && !error && relatedBooks.length" class="container mx-auto px-4 sm:px-6 py-8 sm:py-12">
    <h2 class="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-primary">
      <i class="fas fa-book-reader mr-2 text-secondary"></i>You May Also Like
    </h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6">
      <div v-for="b in relatedBooks" :key="b.id"
           @click="goToBook(b.id)"
           class="cursor-pointer card shadow-lg rounded-xl hover:scale-105 transition-transform bg-base-100 flex flex-col overflow-hidden h-52 sm:h-60 lg:h-64">

        <figure class="h-[70%] w-full overflow-hidden flex-shrink-0">
          <img :src="b.coverUrl" alt="Book cover" 
               class="object-cover w-full h-full"/>
        </figure>

        <div class="p-2 h-[30%] flex flex-col justify-center text-center overflow-hidden">
          <h3 class="font-semibold text-xs sm:text-sm truncate">{{ b.title }}</h3>
          <p v-if="b.authorName" class="text-white hover:text-primary text-xs truncate transition-colors duration-300 mt-0.5">{{ b.authorName }}</p>
        </div>
      </div>
    </div>
  </section>

  
  <section v-if="!loading && !error && relatedBooks.length === 0" class="container mx-auto px-6 py-12">
    <EmptyState
      icon="fas fa-books"
      icon-color="info"
      title="No Related Books"
      description="We couldn't find any similar books at the moment"
      size="sm"
    />
  </section>

</div>
</template>