<template>
  <!-- 
    *** التعديل الأول ***
    ضفنا "data-theme" عشان نفعّل الثيم
    غيرنا "bg-gray-100" لـ "bg-base-200" (عشان ياخد لون الخلفية البيج)
  -->
  <div class="min-h-screen bg-base-200" data-theme="papyrus">
    <section
      class="relative bg-cover bg-center bg-no-repeat text-white py-16 sm:py-20 md:py-24 mb-6 sm:mb-8 md:mb-10 shadow-xl overflow-hidden"
      style="background-image: url('https://mediaaws.almasryalyoum.com/news/large/2014/08/01/238318_0.jpg');">
      <div class="absolute inset-0 bg-black bg-opacity-70"></div>

      <div class="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6">
        <!-- 
          *** التعديل الثاني ***
          غيرنا "text-amber-300" لـ "text-primary"
        -->
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 sm:mb-6 text-primary drop-shadow-lg tracking-wide">
          House of Papyrus
        </h1>

        <!-- 
          *** التعديل الثالث ***
          غيرنا "text-amber-300" لـ "text-primary/90" (نفس اللون بس شفاف سيكا)
        -->
        <p class="text-base sm:text-lg md:text-xl text-primary/90 mb-6 sm:mb-8 leading-relaxed font-light px-2">
          Journey into a world of ancient wisdom
          where scrolls wrote stories, and imagination was immortalised in papyrus.
        </p>

        <!-- 
          *** التعديل الرابع ***
          استبدلنا اللينك اليدوي بـ "btn btn-primary"
        -->
        <a href="/about" class="btn btn-primary rounded-full shadow-lg transition-transform hover:scale-105 text-base py-2.5 sm:py-3 px-6 sm:px-8">
          Enter the Library
        </a>
      </div>
      
      <!-- (اختياري) غيرنا ألوان البلور عشان تليق بالثيم -->
      <div
        class="absolute top-0 left-0 w-32 h-32 sm:w-52 sm:h-52 bg-primary opacity-10 blur-3xl rounded-full"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-secondary opacity-10 blur-3xl rounded-full"
      ></div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
      <!-- 
        *** التعديل الخامس ***
        استبدلنا الـ Spinner اليدوي بـ "loading loading-spinner"
      -->
      <div v-if="loading" class="text-center py-12">
        <span class="loading loading-spinner loading-lg text-primary"></span>
        <p class="mt-4 text-sm sm:text-base text-base-content/70">Loading books...</p>
      </div>

      <!-- 
        *** التعديل السادس ***
        استبدلنا بلوك الإيرور اليدوي بـ "alert alert-error"
      -->
      <div v-else-if="error" class="alert alert-error shadow-lg max-w-lg mx-auto" role="alert">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2.93V5.93c0-.621-.504-1.125-1.125-1.125h-10.5c-.621 0-1.125.504-1.125 1.125v12.15c0 .621.504 1.125 1.125 1.125h10.5c.621 0 1.125-.504 1.125-1.125v-2.93a.926.926 0 00-.926-.926h-1.074a.926.926 0 00-.926.926v2.93h-8.45v-12.15h8.45v2.93a.926.926 0 00.926.926h1.074c.51 0 .926-.416.926-.926z" /></svg>
          <strong>Error!</strong>
          <p class="text-sm">{{ error }}</p>
        </div>
        <div class="flex-none">
          <button @click="fetchBooks" class="btn btn-sm btn-error-content">
            Retry
          </button>
        </div>
      </div>

      <div v-else>
        <!-- 
          *** التعديل السابع ***
          غيرنا "text-gray-800" لـ "text-base-content"
        -->
        <h2 class="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10 text-base-content px-4">
          Our Book Collection
        </h2>

        <!-- 
          الجريد ده سليم لأنه بيستخدم الـ breakpoints الصح (xl)
          اللي ظبطناها في الكارت
        -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8"
        >
          <!-- 
            BookCard component 
            المفروض يكون متعدل وجاهز من الخطوات اللي فاتت
          -->
          <BookCard v-for="book in books" :key="book.id" :book="book" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// كود الجافاسكربت زي ما هو بالظبط مفيهوش أي تغيير
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
Section
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* مش محتاجين أي ستايلات هنا */
</style>