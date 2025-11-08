<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

const author = ref({})
const relatedAuthors = ref([])
const isDark = ref(true)
const loading = ref(true)

// Fetch data for current author
const fetchData = async (authorId) => {
  loading.value = true
  author.value = {}
  relatedAuthors.value = []

  try {
    const resAuthor = await axios.get(`http://localhost:3000/authors/${authorId}`)
    author.value = resAuthor.data

    const resOtherAuthors = await axios.get(`http://localhost:3000/authors?_limit=6`)
    relatedAuthors.value = resOtherAuthors.data.filter(a => a.id != authorId)
  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

// Theme
const updateTheme = () => {
  const saved = document.documentElement.getAttribute('data-theme')
  isDark.value = saved === 'dark'
}

// Navigate to another author
const goToAuthor = (id) => {
  if (route.params.id != id) {
    router.replace({ name: 'author-details', params: { id } })
  }
}

// Mounted
onMounted(() => {
  if (!document.documentElement.getAttribute('data-theme')) {
    document.documentElement.setAttribute('data-theme', 'dark')
  }
  updateTheme()
  fetchData(route.params.id)
})

// Watch route param to fetch new data when ID changes
watch(() => route.params.id, (newId) => {
  fetchData(newId)
})

// Theme observer for dynamic changes
const themeObserver = () => {
  const observer = new MutationObserver(() => updateTheme())
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
}

onMounted(() => {
  themeObserver()
})
</script>

<template>
<div :key="route.fullPath" 
     :class="isDark ? 'bg-base-100 text-base-content' : 'bg-base-100 text-base-content'"
     class="min-h-screen font-sans">

  <!-- Loading Spinner -->
  <div v-if="loading" class="flex justify-center items-center h-96">
    <span :class="isDark ? 'text-white' : 'text-gray-900'">Loading...</span>
  </div>

  <!-- Author Details -->
  <section v-else class="container mx-auto px-6 py-12">
    <div :class="isDark
          ? 'bg-base-100 text-base-content border-gray-700'
          : 'bg-base-100 text-base-content border-gray-200'"
         class="lg:flex shadow-xl rounded-2xl overflow-hidden border">
      
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

  <!-- Related Authors Section -->
  <section v-if="!loading && relatedAuthors.length" class="container mx-auto px-6 py-12">
    <h2 class="text-2xl font-bold mb-6 text-primary">Other Authors</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
      <div v-for="other in relatedAuthors" :key="other.id"
           @click="goToAuthor(other.id)"
           class="cursor-pointer card card-compact shadow-lg rounded-xl hover:scale-105 transition-transform bg-base-100">
        <figure class="h-40 overflow-hidden">
          <img :src="other.avatarUrl" alt="Author" class="object-cover w-full h-full"/>
        </figure>
        <div class="card-body p-3 text-center">
          <h3 class="font-semibold text-sm truncate">{{ other.name }}</h3>
        </div>
      </div>
    </div>
  </section>

</div>
</template>
