<template>
  <div class="p-6 md:p-8 bg-base-200 min-h-screen" dir="ltr" data-theme="papyrus">
    <div class="max-w-6xl mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-3xl">Book Management</h2>
        <div class="divider"></div>

        <!-- Search Filter with Author Dropdown -->
        <SearchFilter
          v-model:searchQuery="searchQuery"
          search-placeholder="Search books..."
          clear-button-text="Clear Filters"
          @clear="clearFilters"
        >
          <template #filters>
            <div class="form-control flex-1">
              <select v-model="selectedAuthorId" class="select select-bordered w-full">
                <option value="">All Authors</option>
                <option v-for="author in authors" :key="author.id" :value="author.id">
                  {{ author.name }}
                </option>
              </select>
            </div>
          </template>
        </SearchFilter>

        <!-- Data Table -->
        <DataTable
          :data="paginatedBooks"
          :columns="columns"
          :loading="loading"
          :error="error"
          loading-message="Loading books..."
          loading-subtext="Fetching your library collection"
          empty-icon="fas fa-book"
          empty-icon-color="primary"
          empty-title="No Books Found"
          :empty-description="searchQuery || selectedAuthorId 
            ? 'Try adjusting your filters to find what you\'re looking for' 
            : 'No books have been added yet. Start building your library!'"
          empty-action-text="Clear Filters"
          empty-action-icon="fas fa-filter-circle-xmark"
          :show-empty-action="!!(searchQuery || selectedAuthorId)"
          @view-details="goToBookDetails"
          @retry="fetchBooks"
          @empty-action="clearFilters"
        >
          <!-- Cover Column -->
          <template #cell-cover="{ item }">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img :src="item.coverUrl" :alt="item.title + ' cover'" />
              </div>
            </div>
          </template>

          <!-- Title Column -->
          <template #cell-title="{ item }">
            <div class="font-bold">{{ item.title }}</div>
          </template>

          <!-- Author Column -->
          <template #cell-author="{ item }">
            <span class="text-sm">{{ getAuthorName(item.authorId) }}</span>
          </template>

          <!-- Year Column -->
          <template #cell-year="{ item }">
            <span class="badge badge-ghost">{{ item.year }}</span>
          </template>

          <!-- Description Column -->
          <template #cell-description="{ item }">
            <span class="text-sm text-base-content/70 line-clamp-2">
              {{ item.description }}
            </span>
          </template>

          <!-- Custom Actions -->
          <template #actions="{ item }">
            <button 
              @click="goToBookDetails(item.id)" 
              class="btn btn-sm btn-primary flex items-center justify-center gap-2"
            >
              <span class="whitespace-nowrap">View Details</span>
            </button>
          </template>

          <!-- Empty State Actions -->
          <template v-if="!searchQuery && !selectedAuthorId" #empty-actions>
            <button class="btn btn-primary gap-2">
              <i class="fas fa-plus"></i>
              Add Your First Book
            </button>
          </template>
        </DataTable>

        <!-- Pagination -->
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev="prevPage"
          @next="nextPage"
          @goto="goToPage"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useToast } from '@/composables/useToast';
import DataTable from '@/components/DataTable.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import Pagination from '@/components/Pagination.vue';
import axios from 'axios';

const router = useRouter();
const route = useRoute();
const { showToast } = useToast();

// Table columns configuration
const columns = [
  { key: 'cover', label: 'Cover' },
  { key: 'title', label: 'Title' },
  { key: 'author', label: 'Author' },
  { key: 'year', label: 'Year' },
  { key: 'description', label: 'Description' }
];

// State variables
const books = ref([]);
const authors = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedAuthorId = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Author lookup map
const authorMap = computed(() => {
  return new Map(authors.value.map(author => [Number(author.id), author.name]));
});

// Fetch authors
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
  loading.value = true;
  error.value = null;
  
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

// Get author name
function getAuthorName(authorId) {
  return authorMap.value.get(Number(authorId)) || 'Unknown Author';
}

// Initialize search from URL
function initializeSearchFromQuery() {
  const queryParam = route.query.q;
  if (queryParam && typeof queryParam === 'string') {
    searchQuery.value = queryParam;
    showToast(`Searching for: ${queryParam}`, 'info');
  }
}

// Filtered books
const filteredBooks = computed(() => {
  let result = books.value;

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(book => 
      book.title.toLowerCase().includes(query)
    );
  }

  if (selectedAuthorId.value) {
    result = result.filter(book => 
      Number(book.authorId) === Number(selectedAuthorId.value)
    );
  }

  return result;
});

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredBooks.value.length / itemsPerPage.value);
});

// Paginated books
const paginatedBooks = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredBooks.value.slice(startIndex, endIndex);
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
  router.replace({ query: {} });
  showToast('Filters cleared', 'info');
}

// Watchers
watch([searchQuery, selectedAuthorId], () => {
  currentPage.value = 1;
});

watch(filteredBooks, (newVal) => {
  if (!loading.value && newVal.length === 0 && (searchQuery.value || selectedAuthorId.value)) {
    showToast('No books found matching your criteria', 'info');
  }
});

onMounted(async () => {
  initializeSearchFromQuery();
  await fetchAuthors();
  await fetchBooks();
});
</script>