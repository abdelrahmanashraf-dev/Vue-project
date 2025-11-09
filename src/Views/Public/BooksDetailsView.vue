<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const book = ref({})
const author = ref({})
const relatedBooks = ref([])

const isDark = ref(true)
const loading = ref(true)

const updateTheme = () => {
  const saved = document.documentElement.getAttribute('data-theme')
  isDark.value = saved === 'dark'
}

const shuffleArray = (array) => array.sort(() => 0.5 - Math.random())

const fetchData = async (id) => {
  loading.value = true
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

  <!-- Loading -->
  <div v-if="loading" class="flex justify-center items-center h-96">
    <span :class="isDark ? 'text-white' : 'text-gray-900'">Loading...</span>
  </div>

  <!-- Book Details -->
  <section v-else class="container mx-auto px-6 py-12">
    <div :class="isDark
          ? 'bg-base-100 text-base-content border-gray-700'
          : 'bg-base-100 text-base-content border-gray-200'"
         class="lg:flex shadow-xl rounded-2xl overflow-hidden border"
         style="min-height: 400px; max-height: 480px;">

      <!-- Book Cover -->
      <figure class="w-full lg:w-1/3 bg-base-200">
        <img :src="book.coverUrl" alt="Book cover"
             class="object-cover w-full h-full transition-transform duration-300 hover:scale-105"/>
      </figure>

      <!-- Book Info -->
      <div class="p-4 lg:p-6 lg:w-2/3 flex flex-col justify-between">
        <div>
          <h2 class="text-2xl lg:text-3xl font-bold mb-2 text-primary">{{ book.title }}</h2>
          <p class="leading-relaxed mb-4">{{ book.description }}</p>

          <ul class="space-y-1 text-sm mb-4">
            <li>
              <span class="font-semibold text-secondary">✍️ Author:</span>
              <span v-if="author.name" 
                    class="ml-1 text-white hover:text-primary cursor-pointer transition-colors duration-300" 
                    @click="goToAuthor(author.id)">
                {{ author.name }}
              </span>
            </li>
            <li>
              <span class="font-semibold text-secondary">📅 Published:</span> {{ book.year }}
            </li>
          </ul>
        </div>

        <div class="flex gap-3 flex-wrap mt-3">
          <button class="bg-primary hover:bg-primary-focus text-white shadow-md px-4 py-2 rounded-lg transition-colors duration-300">
            💖 Add to Wishlist
          </button>
          <router-link to="/books" 
                       class="border border-primary text-primary hover:bg-primary/10 px-4 py-2 rounded-lg transition-colors duration-300">
            ⬅ Back to Books
          </router-link>
        </div>
      </div>
    </div>
  </section>

  <!-- Related Books -->
  <section v-if="relatedBooks.length" class="container mx-auto px-6 py-12">
    <h2 class="text-2xl font-bold mb-6 text-primary">You May Also Like</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      <div v-for="b in relatedBooks" :key="b.id"
           @click="goToBook(b.id)"
           class="cursor-pointer card shadow-lg rounded-xl hover:scale-105 transition-transform bg-base-100 flex flex-col overflow-hidden"
           style="height: 240px; min-height: 240px; max-height: 240px;">

        <figure class="h-[70%] w-full overflow-hidden flex-shrink-0">
          <img :src="b.coverUrl" alt="Book cover" 
               class="object-cover w-full h-full"/>
        </figure>

        <div class="p-2 h-[30%] flex flex-col justify-center text-center overflow-hidden">
          <h3 class="font-semibold text-sm truncate">{{ b.title }}</h3>
          <p v-if="b.authorName" class="text-white hover:text-primary text-sm truncate transition-colors duration-300">{{ b.authorName }}</p>
        </div>
      </div>
    </div>
  </section>

</div>
</template>
