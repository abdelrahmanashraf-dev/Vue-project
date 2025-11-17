<template>
  <div class="min-h-screen bg-base-200" data-theme="papyrus">
    <!-- Hero Section -->
    <section
      class="relative bg-cover bg-center bg-no-repeat text-white py-16 sm:py-20 md:py-24 mb-6 sm:mb-8 md:mb-10 shadow-xl overflow-hidden"
      style="background-image: url('https://mediaaws.almasryalyoum.com/news/large/2014/08/01/238318_0.jpg');">
      <div class="absolute inset-0 bg-black bg-opacity-70"></div>

      <div class="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6">
        <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 sm:mb-6 text-primary drop-shadow-lg tracking-wide">
          House of Papyrus
        </h1>

        <p class="text-base sm:text-lg md:text-xl text-primary/90 mb-6 sm:mb-8 leading-relaxed font-light px-2">
          Journey into a world of ancient wisdom
          where scrolls wrote stories, and imagination was immortalised in papyrus.
        </p>

        <router-link to="/books" class="btn btn-primary rounded-full shadow-lg transition-transform hover:scale-105 text-base py-2.5 sm:py-3 px-6 sm:px-8">
          Enter the Library
        </router-link>
      </div>
      
      <div class="absolute top-0 left-0 w-32 h-32 sm:w-52 sm:h-52 bg-primary opacity-10 blur-3xl rounded-full"></div>
      <div class="absolute bottom-0 right-0 w-48 h-48 sm:w-72 sm:h-72 bg-secondary opacity-10 blur-3xl rounded-full"></div>
    </section>

    <!-- Features Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mb-12">
      <div class="text-center mb-10">
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-base-content mb-4">
          Why Choose Us?
        </h2>
        <p class="text-base-content/70 max-w-2xl mx-auto">
          Discover what makes House of Papyrus your ultimate destination for literary exploration
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div v-for="feature in features" :key="feature.title"
             class="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 border-t-4 border-primary">
          <div class="card-body text-center">
            <div class="text-5xl mb-4">
              <i :class="[feature.icon, feature.color]"></i>
            </div>
            <h3 class="card-title justify-center text-xl font-serif mb-2 text-base-content">
              {{ feature.title }}
            </h3>
            <p class="text-base-content/70">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="bg-gradient-to-br from-primary/10 to-secondary/10 py-16 mb-12">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in statistics" :key="stat.label" 
               class="text-center p-6 bg-base-100 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
            <div class="text-4xl md:text-5xl font-bold text-primary mb-2">
              {{ stat.value }}
            </div>
            <div class="text-sm md:text-base text-base-content/70 font-semibold">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
      <!-- Loading State -->
      <LoadingSpinner 
        v-if="loading"
        message="Loading books..."
        subtext="Please wait while we gather our collection"
        size="lg"
      />

      <!-- Error State -->
      <EmptyState
        v-else-if="error"
        icon="fas fa-exclamation-circle"
        icon-color="error"
        :title="'Oops! Something went wrong'"
        :description="error"
        action-text="Try Again"
        action-icon="fas fa-redo"
        action-button-class="btn-error"
        :show-default-action="true"
        @action="fetchBooks"
      />

      <!-- Books Section -->
      <div v-else>
        <div class="flex items-center justify-between mb-8 sm:mb-10 px-4">
          <h2 class="text-2xl sm:text-3xl font-bold text-base-content">
            Our Book Collection
          </h2>
          <a href="/books" class="btn btn-outline btn-sm gap-2">
            View All
            <i class="fas fa-chevron-right"></i>
          </a>
        </div>

        <!-- Empty State for no books -->
        <EmptyState
          v-if="books.length === 0"
          icon="fas fa-book-open"
          icon-color="primary"
          title="No Books Available Yet"
          description="Our collection is currently empty. Check back soon for amazing reads!"
          size="md"
        />

        <!-- Books Grid -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 xl:gap-8">
          <BookCard v-for="book in featuredBooks" :key="book.id" :book="book" />
        </div>
        
        <!-- Show message if there are more books -->
        <div v-if="books.length > 6" class="text-center mt-8">
          <p class="text-base-content/60 mb-4">
            Showing {{ featuredBooks.length }} of {{ books.length }} books
          </p>
        </div>
      </div>
    </div>

    <!-- Categories Section -->
    <section class="bg-base-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-10">
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-base-content mb-4">
            Explore by Genre
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            Browse through our carefully curated collections spanning diverse literary genres
          </p>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="genre in genres" :key="genre.name"
               class="card bg-base-200 hover:bg-primary hover:text-primary-content shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <div class="card-body items-center text-center p-6">
              <div class="text-4xl mb-3 group-hover:scale-110 transition-transform">
                <i :class="[genre.icon, genre.color, 'group-hover:text-primary-content']"></i>
              </div>
              <h3 class="font-semibold text-lg">{{ genre.name }}</h3>
              <p class="text-sm opacity-70">{{ genre.count }} books</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-10">
          <h2 class="text-3xl sm:text-4xl font-serif font-bold text-base-content mb-4">
            What Readers Say
          </h2>
          <p class="text-base-content/70 max-w-2xl mx-auto">
            Join thousands of satisfied readers who have discovered their next favorite book with us
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="testimonial in testimonials" :key="testimonial.name"
               class="card bg-base-100 shadow-xl">
            <div class="card-body">
              <div class="flex items-center gap-1 mb-4">
                <i v-for="i in 5" :key="i" class="fas fa-star text-primary text-xl"></i>
              </div>
              <p class="text-base-content/80 italic mb-4">"{{ testimonial.text }}"</p>
              <div class="flex items-center gap-3 mt-auto">
                <div class="avatar">
                  <div class="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    <img :src="testimonial.avatar" :alt="testimonial.name" />
                  </div>
                </div>
                <div>
                  <h4 class="font-semibold text-base-content">{{ testimonial.name }}</h4>
                  <p class="text-sm text-base-content/60">{{ testimonial.role }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-gradient-to-r from-primary/20 to-secondary/20 py-16">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div class="text-5xl mb-6">
          <i class="fas fa-envelope text-primary"></i>
        </div>
        <h2 class="text-3xl sm:text-4xl font-serif font-bold text-base-content mb-4">
          Stay Updated
        </h2>
        <p class="text-base-content/70 mb-8 max-w-2xl mx-auto">
          Subscribe to our newsletter and be the first to know about new releases, exclusive content, and special offers
        </p>
        
        <div class="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email" 
            class="input input-bordered flex-1"
          />
          <button class="btn btn-primary">
            Subscribe
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import BookCard from "@/components/Books/BookCard.vue";
import LoadingSpinner from "@/components/Ui/LoadingSpinner.vue";
import EmptyState from "@/components/Ui/EmptyState.vue";

export default {
  name: "HomeView",
  components: { 
    BookCard,
    LoadingSpinner,
    EmptyState
  },
  data() {
    return {
      books: [],
      loading: false,
      error: null,
      maxBooksToShow: 6,
      features: [
        {
          icon: "fas fa-book",
          color: "text-primary",
          title: "Vast Collection",
          description: "Access thousands of books spanning multiple genres and time periods"
        },
        {
          icon: "fas fa-search",
          color: "text-secondary",
          title: "Smart Search",
          description: "Find exactly what you're looking for with our advanced search system"
        },
        {
          icon: "fas fa-gem",
          color: "text-accent",
          title: "Curated Selection",
          description: "Hand-picked titles ensuring quality and relevance for every reader"
        }
      ],
      statistics: [
        { value: "50K+", label: "Books" },
        { value: "200+", label: "Authors" },
        { value: "100K+", label: "Readers" },
        { value: "4.9★", label: "Rating" }
      ],
      genres: [
        { name: "Fiction", icon: "fas fa-book-open", color: "text-primary", count: 12500 },
        { name: "History", icon: "fas fa-landmark", color: "text-secondary", count: 8300 },
        { name: "Science", icon: "fas fa-flask", color: "text-accent", count: 6700 },
        { name: "Poetry", icon: "fas fa-feather-alt", color: "text-primary", count: 4200 },
        { name: "Philosophy", icon: "fas fa-brain", color: "text-secondary", count: 5500 },
        { name: "Biography", icon: "fas fa-user", color: "text-accent", count: 3800 },
        { name: "Mystery", icon: "fas fa-search", color: "text-primary", count: 7100 },
        { name: "Romance", icon: "fas fa-heart", color: "text-secondary", count: 9200 }
      ],
      testimonials: [
        {
          name: "Sarah Ahmed",
          role: "Book Enthusiast",
          avatar: "https://ui-avatars.com/api/?name=Sarah+Ahmed&background=d4af37&color=fff&size=128",
          text: "House of Papyrus has completely transformed my reading experience. The collection is incredible and the interface is so intuitive!"
        },
        {
          name: "Mohamed Hassan",
          role: "History Teacher",
          avatar: "https://ui-avatars.com/api/?name=Mohamed+Hassan&background=bfa76f&color=fff&size=128",
          text: "As an educator, I find their ancient manuscripts collection invaluable. It's like having the Library of Alexandria at my fingertips."
        },
        {
          name: "Nour El-Din",
          role: "Literature Student",
          avatar: "https://ui-avatars.com/api/?name=Nour+ElDin&background=a1802d&color=fff&size=128",
          text: "The perfect blend of classic literature and modern convenience. I've discovered so many hidden gems here!"
        }
      ]
    };
  },
  mounted() {
    this.fetchBooks();
  },
  computed: {
    featuredBooks() {
      return this.books.slice(0, this.maxBooksToShow);
    }
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      this.error = null;
      
      try {
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