<template>
  <div class="min-h-screen bg-gray-100">
    <section
      class="relative bg-cover bg-center bg-no-repeat text-white py-16 sm:py-20 md:py-24 mb-6 sm:mb-8 md:mb-10 shadow-xl overflow-hidden"
      style="background-image: url('https://mediaaws.almasryalyoum.com/news/large/2014/08/01/238318_0.jpg');">
      <div class="absolute inset-0 bg-black bg-opacity-70"></div>

      <div class="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 sm:mb-6 text-amber-300 drop-shadow-lg tracking-wide">
          House of Papyrus
        </h1>

        <p class="text-base sm:text-lg md:text-xl text-amber-300 mb-6 sm:mb-8 leading-relaxed font-light px-2">
          Journey into a world of ancient wisdom
          where scrolls wrote stories, and imagination was immortalised in papyrus.
        </p>

        <a href="/about" class="inline-block bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm sm:text-base py-2.5 sm:py-3 px-6 sm:px-8 rounded-full shadow-lg transition-transform hover:scale-105">
          Enter the Library
        </a>
      </div>
      <div
        class="absolute top-0 left-0 w-32 h-32 sm:w-52 sm:h-52 bg-amber-400 opacity-10 blur-3xl rounded-full"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-amber-600 opacity-10 blur-3xl rounded-full"
      ></div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-500"></div>
        <p class="mt-4 text-sm sm:text-base text-gray-600">Loading books...</p>
      </div>

      <div v-else-if="error" class="text-center py-12 px-4">
        <p class="text-red-600 mb-4 text-sm sm:text-base">{{ error }}</p>
        <button 
          @click="fetchBooks" 
          class="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm sm:text-base py-2 px-6 rounded-full">
          Retry
        </button>
      </div>

      <div v-else>
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-gray-800 px-4">
          Our Book Collection
        </h2>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8"
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
        // تأكد إن السيرفر شغال على البورت ده
        const response = await fetch('http://localhost:3000/books');
        
        if (!response.ok) {
          throw new Error('Failed to fetch books. Make sure json-server is running on port 3000.');
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

<style scoped>
/* أي ستايلات خاصة بالـ HomeView بس ممكن تتحط هنا */
</style>