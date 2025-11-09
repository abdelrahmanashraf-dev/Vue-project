<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const author = ref({})
const relatedAuthors = ref([])
const authorBooks = ref([]) 

const isDark = ref(true)
const loading = ref(true)

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

// Shuffle helper
const shuffleArray = (array) => array.sort(() => 0.5 - Math.random())

// Fetch author + related + top 2 books
const fetchData = async (authorId) => {
  loading.value = true
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
  } catch (error) {
    console.error(error)
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
  <div v-if="loading" class="flex justify-center items-center h-96">
    <span :class="isDark ? 'text-white' : 'text-gray-900'">Loading...</span>
  </div>

  <!-- Author Details -->
  <section v-else class="container mx-auto px-6 py-12">
    <div :class="isDark ? 'bg-base-100 text-base-content border-gray-700' : 'bg-base-100 text-base-content border-gray-200'" 
         class="lg:flex shadow-xl rounded-2xl overflow-hidden border"
         style="min-height: 400px; max-height: 480px;"> 

      <!-- Author Avatar -->
      <figure class="w-full lg:w-1/3 bg-base-200">
        <img :src="author.avatarUrl" alt="Author photo"
             class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"/>
      </figure>

      <!-- Author Info -->
      <div class="p-6 lg:w-2/3 flex flex-col justify-between">
        <div>
          <h2 class="text-3xl font-bold mb-2 text-primary">{{ author.name }}</h2>
          <p class="leading-relaxed mb-6">{{ author.bio }}</p>

          <h3 class="font-semibold mb-2 text-secondary">📚 Top Works:</h3>
          <ul class="list-disc pl-5 space-y-1 text-sm">
            <li v-for="book in authorBooks" :key="book.id" class="cursor-pointer hover:text-primary" @click="goToBook(book.id)">
              {{ book.title }} ({{ book.year }})
            </li>
          </ul>
        </div>

        <div class="flex gap-3 flex-wrap mt-4">
          <router-link to="/authors"
                       class="border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors duration-300">
            ⬅ Back to Authors
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Related Authors -->
  <section v-if="!loading && relatedAuthors.length" class="container mx-auto px-6 py-12">
    <h2 class="text-2xl font-bold mb-6 text-primary">Other Authors</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      <div v-for="other in relatedAuthors" :key="other.id"
           class="cursor-pointer card shadow-lg rounded-xl hover:scale-105 transition-transform bg-base-100 flex flex-col overflow-hidden"
           style="height: 220px;"
           @click="goToAuthor(other.id)">

        <figure class="h-[55%] w-full overflow-hidden flex-shrink-0">
          <img :src="other.avatarUrl" alt="Author" class="object-cover w-full h-full"/>
        </figure>

        <div class="p-1 h-[45%] flex flex-col justify-center text-center overflow-hidden">
          <h3 class="font-semibold text-sm truncate mb-1">{{ other.name }}</h3>
          <ul v-if="other.topBooks" class="text-xs text-secondary space-y-1 mt-1">
            <li v-for="book in other.topBooks" :key="book.id" class="truncate cursor-pointer hover:text-primary" @click.stop="goToBook(book.id)">
              {{ book.title }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

</div>
</template>
