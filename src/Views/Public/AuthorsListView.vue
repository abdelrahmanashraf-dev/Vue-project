<template>
  <div class="p-6 md:p-8 bg-base-200 min-h-screen" dir="ltr">
    <div class="max-w-6xl mx-auto card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-3xl">Author Management</h2>
        <div class="divider"></div>

        <!-- Search Filter -->
        <SearchFilter
          v-model:searchQuery="searchQuery"
          search-placeholder="Search authors..."
          clear-button-text="Clear Search"
          @clear="clearSearch"
        />

        <!-- Data Table -->
        <DataTable
          :data="paginatedAuthors"
          :columns="columns"
          :loading="loading"
          :error="error"
          loading-message="Loading authors..."
          loading-subtext="Gathering information about our writers"
          empty-icon="fas fa-user-pen"
          empty-icon-color="secondary"
          empty-title="No Authors Found"
          :empty-description="searchQuery 
            ? 'No authors match your search criteria. Try a different search term.' 
            : 'No authors have been added yet. Start building your author collection!'"
          empty-action-text="Clear Search"
          empty-action-icon="fas fa-times"
          :show-empty-action="!!searchQuery"
          @view-details="goToAuthorDetails"
          @retry="fetchAuthors"
          @empty-action="clearSearch"
        >
          <!-- Avatar Column -->
          <template #cell-avatar="{ item }">
            <div class="avatar">
              <div class="mask mask-squircle w-12 h-12">
                <img :src="item.avatarUrl" :alt="item.name + ' photo'" />
              </div>
            </div>
          </template>

          <!-- Name Column -->
          <template #cell-name="{ item }">
            <div class="font-bold">{{ item.name }}</div>
          </template>

          <!-- Bio Column -->
          <template #cell-bio="{ item }">
            <span class="text-sm text-base-content/70 line-clamp-2">
              {{ item.bio }}
            </span>
          </template>

          <!-- Empty State Actions -->
          <template v-if="!searchQuery" #empty-actions>
            <button class="btn btn-primary gap-2">
              <i class="fas fa-plus"></i>
              Add Your First Author
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
import { useRouter } from 'vue-router';
import { useToast } from '@/composables/useToast';
import DataTable from '@/components/DataTable.vue';
import SearchFilter from '@/components/SearchFilter.vue';
import Pagination from '@/components/Pagination.vue';
import axios from 'axios';

const router = useRouter();
const { showToast } = useToast();

// Table columns configuration
const columns = [
  { key: 'avatar', label: 'Image' },
  { key: 'name', label: 'Name' },
  { key: 'bio', label: 'Bio / Description' }
];

// State variables
const authors = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(5);

// Fetch authors
async function fetchAuthors() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await axios.get('http://localhost:3000/authors');
    authors.value = response.data;
    
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

// Total pages
const totalPages = computed(() => {
  return Math.ceil(filteredAuthors.value.length / itemsPerPage.value);
});

// Paginated authors
const paginatedAuthors = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredAuthors.value.slice(startIndex, endIndex);
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

// Watchers
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