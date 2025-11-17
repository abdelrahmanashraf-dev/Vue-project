<template>
  <div class="p-6 md:p-8 bg-base-200 min-h-screen" dir="ltr">
    
    <div class="max-w-6xl mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        
        <h2 class="card-title text-3xl">Author Management</h2>
        <div class="divider"></div>

        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <div class="form-control flex-1">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search authors..." 
              class="input input-bordered w-full"
            />
          </div>

          <div class="form-control">
            <button @click="clearSearch" class="btn btn-outline mt-auto">
              Clear Search
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <LoadingSpinner 
          v-if="loading"
          message="Loading authors..."
          subtext="Gathering information about our writers"
          size="lg"
        />

        <!-- Error State -->
        <EmptyState
          v-else-if="error"
          icon="fas fa-exclamation-triangle"
          icon-color="error"
          title="Failed to Load Authors"
          :description="error.message"
          action-text="Retry"
          action-icon="fas fa-redo"
          action-button-class="btn-error"
          :show-default-action="true"
          @action="fetchAuthors"
        />

        <!-- Authors Table -->
        <div v-else-if="filteredAuthors.length">
          <div class="overflow-x-auto">
            <table class="table w-full table-zebra">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Bio / Description</th>
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
                    <button 
                      @click="goToAuthorDetails(author.id)" 
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
        
        <!-- Empty State -->
        <EmptyState
          v-else
          icon="fas fa-user-pen"
          icon-color="secondary"
          title="No Authors Found"
          :description="searchQuery 
            ? 'No authors match your search criteria. Try a different search term.' 
            : 'No authors have been added yet. Start building your author collection!'"
          action-text="Clear Search"
          action-icon="fas fa-times"
          :show-default-action="!!searchQuery"
          @action="clearSearch"
        >
          <template v-if="!searchQuery" #actions>
            <button class="btn btn-primary gap-2">
              <i class="fas fa-plus"></i>
              Add Your First Author
            </button>
          </template>
        </EmptyState>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue';
import EmptyState from '@/components/Ui/EmptyState.vue';
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
  loading.value = true;
  error.value = null;
  
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


watch(searchQuery, () => {
  currentPage.value = 1;
});


watch(filteredAuthors, (newVal) => {
  if (!loading.value && newVal.length === 0 && searchQuery.value) {
    showToast('No authors found matching your criteria', 'info');
  }
});

onMounted(fetchAuthors);
</script>