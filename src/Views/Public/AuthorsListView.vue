<template>
  <div class="p-6 md:p-8 bg-base-200 min-h-screen" dir="ltr">
    <div class="max-w-6xl mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        
        <h2 class="card-title text-3xl">Author Management</h2>
        <div class="divider"></div>

        <!-- Search Section -->
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <!-- Search by Name -->
          <div class="form-control flex-1">
         
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search authors..." 
              class="input input-bordered w-full"
            />
          </div>

          <!-- Clear Search Button -->
          <div class="form-control">
            <label class="label">
              <span class="label-text">&nbsp;</span>
            </label>
            <button @click="clearSearch" class="btn btn-outline">
              Clear Search
            </button>
          </div>
        </div>

        

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-10">
          <span class="loading loading-lg loading-spinner text-primary"></span>
          <p class="mt-2">Loading authors...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="alert alert-error shadow-lg" role="alert">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2 2m2-2l2 2m7-2.93V5.93c0-.621-.504-1.125-1.125-1.125h-10.5c-.621 0-1.125.504-1.125 1.125v12.15c0 .621.504 1.125 1.125 1.125h10.5c.621 0 1.125-.504 1.125-1.125v-2.93a.926.926 0 00-.926-.926h-1.074a.926.926 0 00-.926.926v2.93h-8.45v-12.15h8.45v2.93a.926.926 0 00.926.926h1.074c.51 0 .926-.416.926-.926z" />
            </svg>
            <strong>Error!</strong> {{ error.message }}
          </div>
        </div>

        <!-- Authors Table -->
        <div v-else-if="filteredAuthors.length">
          <div class="overflow-x-auto">
            <table class="table w-full table-zebra">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Bio / Description</th>
                  <th>Genre / Specialty</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="author in paginatedAuthors" :key="author.id" class="hover">
                  <td>
                    <div class="avatar">
                      <div class="mask mask-squircle w-12 h-12">
                        <img :src="author.avatarUrl" :alt="author.name + ' photo'" />
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="font-bold">{{ author.name }}</div>
                  </td>
                  <td>
                    <span class="text-sm text-base-content/70 line-clamp-2">
                      {{ author.bio }}
                    </span>
                  </td>
                  <td>
                    <span class="badge badge-primary badge-outline">
                      {{ author.genre || 'General' }}
                    </span>
                  </td>
                  <td>
                    <button 
                      @click="goToAuthorDetails(author.id)" 
                      class="btn btn-sm btn-primary px-4 "
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- Pagination -->
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
        
        <!-- Empty State -->
        <div v-else class="alert alert-info shadow-lg">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>No authors match your search criteria.</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import axios from 'axios';

const router = useRouter();
const { showToast } = useToast();

// State variables
const authors = ref([]);
const loading = ref(true);
const error = ref(null);

// Search
const searchQuery = ref('');

// Pagination state
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Fetch authors
async function fetchAuthors() {
  try {
    const response = await axios.get('http://localhost:3000/authors');
    authors.value = response.data;
    
    // Show success toast
    if (authors.value.length > 0) {
      showToast(`Loaded ${authors.value.length} authors successfully`, 'success');
    }
  } catch (err) {
    console.error('Failed to fetch authors:', err);
    error.value = err;
    showToast('Failed to load authors. Please try again.', 'error');
  } finally {
    loading.value = false;
  }
}

// Filtered authors based on search
const filteredAuthors = computed(() => {
  if (!searchQuery.value.trim()) {
    return authors.value;
  }

  const query = searchQuery.value.toLowerCase();
  return authors.value.filter(author =>
    author.name.toLowerCase().includes(query)
  );
});

// Total pages based on filtered results
const totalPages = computed(() => {
  return Math.ceil(filteredAuthors.value.length / itemsPerPage.value);
});

// Paginated authors
const paginatedAuthors = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredAuthors.value.slice(startIndex, endIndex);
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

function goToAuthorDetails(authorId) {
  router.push({ name: 'author-details', params: { id: authorId } });
}

function clearSearch() {
  searchQuery.value = '';
  currentPage.value = 1;
  showToast('Search cleared', 'info');
}

// Reset to page 1 when search changes
watch(searchQuery, () => {
  currentPage.value = 1;
});

// Show toast when no results found
watch(filteredAuthors, (newVal) => {
  if (!loading.value && newVal.length === 0 && searchQuery.value) {
    showToast('No authors found matching your criteria', 'info');
  }
});

onMounted(fetchAuthors);
</script>

<style scoped>

</style>