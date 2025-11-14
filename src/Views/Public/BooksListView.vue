<template>
  <div class="p-6 md:p-8 bg-base-200 min-h-screen" dir="ltr" data-theme="papyrus">
    
    <div class="max-w-6xl mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        
        <h2 class="card-title text-3xl">Book Management</h2>
        <div class="divider"></div>

        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <div class="form-control flex-1">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search books..." 
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control flex-1">
            <select v-model="selectedAuthorId" class="select select-bordered w-full">
              <option value="">All Authors</option>
              <option v-for="author in authors" :key="author.id" :value="author.id">
                {{ author.name }}
              </option>
            </select>
          </div>

          <div class="form-control">
            <button @click="clearFilters" class="btn btn-outline mt-auto">
              Clear Filters
            </button>
          </div>
        </div>

        <div v-if="loading" class="text-center py-10">
          <span class="loading loading-lg loading-spinner text-primary"></span>
          <p class="mt-2">Loading books...</p>
        </div>

        <div v-else-if="error" class="alert alert-error shadow-lg" role="alert">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2.93V5.93c0-.621-.504-1.125-1.125-1.125h-10.5c-.621 0-1.125.504-1.125 1.125v12.15c0 .621.504 1.125 1.125 1.125h10.5c.621 0 1.125-.504 1.125-1.125v-2.93a.926.926 0 00-.926-.926h-1.074a.926.926 0 00-.926.926v2.93h-8.45v-12.15h8.45v2.93a.926.926 0 00.926.926h1.074c.51 0 .926-.416.926-.926z" />
            </svg>
            <strong>Error!</strong> {{ error.message }}
          </div>
        </div>

        <div v-else-if="filteredBooks.length">
          <div class="overflow-x-auto">
            <table class="table w-full table-zebra">
              <thead>
                <tr>
                  <th>Cover</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Year</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="book in paginatedBooks" :key="book.id" class="hover">
                  <td>
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <img :src="book.coverUrl" :alt="book.title + ' cover'" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="font-bold">{{ book.title }}</div>
                  </td>
                  <td>
                    <span class="text-sm">
                      {{ getAuthorName(book.authorId) }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-ghost">{{ book.year }}</span>
                  </td>
                  <td>
                    <span class="text-sm text-base-content/70 line-clamp-2">
                      {{ book.description }}
                    </span>
                  </td>
                  <td>
                    <button 
                      @click="goToBookDetails(book.id)" 
                      class="btn btn-sm btn-primary px-4"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-if="totalPages > 1" class="flex justify-center pt-6 gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="btn">«</button>
            
            <button 
              v-for="page in displayedPages"
              :key="page"
              class="btn" 
              :class="{ 'btn-active': page === currentPage }"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
            
            <button @click="nextPage" :disabled="currentPage === totalPages" class="btn">»</button>
          </div>
        </div>
        
        <div v-else class="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No books match your search criteria.</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // 👈 أضف useRoute
import { useToast } from '@/composables/useToast';
import axios from 'axios';

const router = useRouter();
const route = useRoute(); // 👈 استخدم route عشان تقرا الـ query
const { showToast } = useToast();

// State variables
const books = ref([]);
const authors = ref([]);
const loading = ref(true);
const error = ref(null);

// Search and Filter
const searchQuery = ref('');
const selectedAuthorId = ref('');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Create a Map for faster author lookup
const authorMap = computed(() => {
  return new Map(authors.value.map(author => [Number(author.id), author.name]));
});

// Fetch authors for the filter dropdown
async function fetchAuthors() {
  try {
    const response = await axios.get('http://localhost:3000/authors');
    authors.value = response.data;
  } catch (err) {
    console.error('Failed to fetch authors:', err);
    showToast('Failed to load authors list', 'error');
  }
}

// Fetch books
async function fetchBooks() {
  try {
    const response = await axios.get('http://localhost:3000/books');
    books.value = response.data;
    
    if (books.value.length > 0) {
      showToast(`Loaded ${books.value.length} books successfully`, 'success');
    }
  } catch (err) {
    console.error('Failed to fetch books:', err);
    error.value = err;
    showToast('Failed to load books. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
}

// Get author name by ID (optimized with Map)
function getAuthorName(authorId) {
  return authorMap.value.get(Number(authorId)) || 'Unknown Author';
}

// Filtered books based on search and author filter
const filteredBooks = computed(() => {
  let result = books.value;

  // Search by title
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(book => 
      book.title.toLowerCase().includes(query)
    );
  }

  // Filter by author
  if (selectedAuthorId.value) {
    result = result.filter(book => 
      Number(book.authorId) === Number(selectedAuthorId.value)
    );
  }

  return result;
});

// Total pages based on filtered results
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage.value);
});

// Paginated books
const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredBooks.value.slice(startIndex, endIndex);
});

// Display limited page numbers for pagination
const displayedPages = computed(() => {
  const pages = [];
  const maxDisplayed = 5;
  
  if (totalPages.value <= maxDisplayed) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages.value);
    } else if (currentPage.value >= totalPages.value - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages.value - 3; i <= totalPages.value; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(currentPage.value - 1);
      pages.push(currentPage.value);
      pages.push(currentPage.value + 1);
      pages.push('...');
      pages.push(totalPages.value);
    }
  }
  
  return pages;
});

// Navigation functions
function goToPage(page) {
  if (page !== '...') {
    currentPage.value = page;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToBookDetails(bookId) {
  router.push({ name: 'book-details', params: { id: bookId } });
}

function clearFilters() {
  searchQuery.value = '';
  selectedAuthorId.value = '';
  currentPage.value = 1;
  
  // 👈 امسح الـ query parameter من الـ URL
  router.replace({ query: {} });
  
  showToast('Filters cleared', 'info');
}

// Reset to page 1 when filters change
watch([searchQuery, selectedAuthorId], () => {
  currentPage.value = 1;
});

// Show toast when no results found
watch(filteredBooks, (newVal) => {
  if (!loading.value && newVal.length === 0 && (searchQuery.value || selectedAuthorId.value)) {
    showToast('No books found matching your criteria', 'info');
  }
});

// 🎯 اقرا الـ query parameter من الـ URL لما الصفحة تفتح
watch(() => route.query.q, (newQuery) => {
  if (newQuery) {
    searchQuery.value = newQuery;
    showToast(`Searching for: ${newQuery}`, 'info');
  }
}, { immediate: true }); // 👈 immediate: true عشان يشتغل أول ما الصفحة تحمل

onMounted(async () => {
  await fetchAuthors();
  await fetchBooks();
});
</script>

<style scoped>
/* No styles needed - DaisyUI theme handles everything */
</style>