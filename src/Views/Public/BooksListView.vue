<template>
  <div class="p-6 md:p-8 bg-base-200 min-h-screen" dir="ltr">
    <div class="max-w-6xl mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        
        <h2 class="card-title text-3xl">Book Management</h2>
        <div class="divider"></div> 

        <div v-if="loading" class="text-center py-10">
          <span class="loading loading-lg loading-spinner text-primary"></span>
          <p class="mt-2">Loading books...</p>
        </div>

        <div v-else-if="error" class="alert alert-error shadow-lg" role="alert">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2.93V5.93c0-.621-.504-1.125-1.125-1.125h-10.5c-.621 0-1.125.504-1.125 1.125v12.15c0 .621.504 1.125 1.125 1.125h10.5c.621 0 1.125-.504 1.125-1.125v-2.93a.926.926 0 00-.926-.926h-1.074a.926.926 0 00-.926.926v2.93h-8.45v-12.15h8.45v2.93a.926.926 0 00.926.926h1.074c.51 0 .926-.416.926-.926z" /></svg>
            <strong>Error!</strong> An error occurred while fetching data: {{ error.message }}
          </div>
        </div>

        <div v-else-if="books.length">
          <div class="overflow-x-auto">
            <table class="table w-full table-zebra">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Description</th>
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
                    <span class="text-sm text-base-content/70">
                      {{ book.description }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-primary badge-outline">
                      {{ book.genre }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div v-if="totalPages > 1" class="flex justify-center pt-6 gap-2">
            <button @click="prevPage" :disabled="currentPage === 1" class="btn">«</button>
            
            <button 
              v-for="page in totalPages"
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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>No books to display at this time.</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

// State variables
const books = ref([]); 
const loading = ref(true);
const error = ref(null); 

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5); // يمكنك تغيير هذا الرقم

// Computed property for total pages
const totalPages = computed(() => {
  return Math.ceil(books.value.length / itemsPerPage.value);
});

// Computed property for books on the current page
const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return books.value.slice(startIndex, endIndex);
});

// Navigation functions
function goToPage(page) {
  currentPage.value = page;
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

// Fetch data function
async function fetchBooks() {
  try {
    const response = await axios.get('http://localhost:3000/books');
    books.value = response.data; 
  } catch (err) {
    console.error('Failed to fetch books:', err);
    error.value = err; 
  } finally {
    loading.value = false; 
  }
}

onMounted(fetchBooks);
</script>

<style scoped>
/* No extra CSS needed */
</style>