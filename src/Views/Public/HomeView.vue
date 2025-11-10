<template>
  <div class="min-h-screen bg-gray-100">
    <section
      class="relative bg-cover bg-center bg-no-repeat text-white py-24 mb-10 rounded-3xl shadow-xl overflow-hidden"
      style="background-image: url('https://mediaaws.almasryalyoum.com/news/large/2014/08/01/238318_0.jpg');">
      <div class="absolute inset-0 bg-black bg-opacity-70"></div>

      <div class="relative z-10 max-w-5xl mx-auto text-center px-4">
        <h1 class="text-5xl md:text-6xl font-serif font-bold mb-6 text-amber-300 drop-shadow-lg tracking-wide">
          House of Papyrus
        </h1>

        <p class="text-lg md:text-xl text-amber-300 mb-8 leading-relaxed font-light">
          Journey into a world of ancient wisdom
          where scrolls wrote stories, and imagination was immortalised in papyrus.
        </p>

        <a href="/about" class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
          Enter the Library
        </a>
      </div>
      <div
        class="absolute top-0 left-0 w-52 h-52 bg-amber-400 opacity-10 blur-3xl rounded-full"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-72 h-72 bg-amber-600 opacity-10 blur-3xl rounded-full"
      ></div>
    </section>


    <div class="max-w-7xl mx-auto px-4 pb-16">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
        <p class="mt-4 text-gray-600">Loading books...</p>
      </div>


      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-600 mb-4">{{ error }}</p>
        <button 
          @click="fetchBooks" 
          class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 px-6 rounded-full">
          Retry
        </button>
      </div>

      <!-- Books Grid -->
      <div v-else>
        <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
          Our Book Collection
        </h2>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
        >
          <BookCard v-for="book in books" :key="book.id" :book="book" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from "@/components/Books/BookCard.vue";

export default {
  name: "HomeView",
  components: { BookCard },
  data() {
    return {
      books: [],
      loading: false,
      error: null
    };
  },
  mounted() {
    this.fetchBooks();
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      this.error = null;
      
      try {
        const response = await fetch('http://localhost:3001/books');
        
        if (!response.ok) {
          throw new Error('Failed to fetch books. Make sure json-server is running on port 3001.');
        }
        
        this.books = await response.json();
      } catch (err) {
        this.error = err.message;
        console.error('Error fetching books:', err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>