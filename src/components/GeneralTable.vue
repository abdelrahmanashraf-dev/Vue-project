<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '@/components/Ui/Toast.vue'

const props = defineProps({
  // Store instance (useBooksStore or useAuthorsStore)
  store: {
    type: Object,
    required: true
  },
  // Related store for filtering (e.g., authorsStore for books)
  relatedStore: {
    type: Object,
    default: null
  },
  // Entity config
  config: {
    type: Object,
    required: true,
    // Example: {
    //   entityName: 'Book', // singular
    //   entityNamePlural: 'Books', // plural
    //   icon: '📚',
    //   basePath: '/admin/books',
    //   searchField: 'title', // field to search in
    //   filterField: 'authorId', // field to filter by (optional)
    //   filterLabel: 'Author', // label for filter
    //   getFilterOptions: (relatedStore) => relatedStore.authors, // function to get filter options
    //   getFilterOptionLabel: (option) => option.name,
    //   columns: [
    //     { key: 'title', label: 'Title', type: 'text' },
    //     { key: 'authorId', label: 'Author', type: 'relation', getLabel: (id, relatedStore) => ... },
    //     { key: 'year', label: 'Year', type: 'number' },
    //     { key: 'tags', label: 'Tags', type: 'tags' }
    //   ]
    // }
  }
})

const router = useRouter()

// State
const searchQuery = ref('')
const selectedFilter = ref('')
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const viewMode = ref('grid')

// Toast state
const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

onMounted(async () => {
  if (props.relatedStore) {
    await props.relatedStore.fetchAuthors?.() || await props.relatedStore.fetchBooks?.()
  }
  await props.store.fetchAuthors?.() || await props.store.fetchBooks?.()
})

// Get items from store
const items = computed(() => {
  return props.store.books || props.store.authors || []
})

// Filtered items
const filteredItems = computed(() => {
  let result = items.value

  // Search
  if (searchQuery.value && props.config.searchField) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item =>
      String(item[props.config.searchField]).toLowerCase().includes(query)
    )
  }

  // Filter by related entity
  if (selectedFilter.value && props.config.filterField) {
    result = result.filter(item => 
      item[props.config.filterField] === parseInt(selectedFilter.value)
    )
  }

  return result
})

// Get filter options
const filterOptions = computed(() => {
  if (!props.config.getFilterOptions || !props.relatedStore) return []
  return props.config.getFilterOptions(props.relatedStore)
})

// Get column display value
const getColumnValue = (item, column) => {
  if (column.type === 'relation' && column.getLabel) {
    return column.getLabel(item[column.key], props.relatedStore)
  }
  if (column.type === 'tags') {
    return item[column.key] || []
  }
  return item[column.key]
}

// Actions
const goToCreate = () => {
  router.push(`${props.config.basePath}/new`)
}

const goToEdit = (id) => {
  router.push(`${props.config.basePath}/${id}/edit`)
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  itemToDelete.value = null
}

const deleteItem = async () => {
  try {
    await props.store.deleteAuthor?.(itemToDelete.value.id) || 
          await props.store.deleteBook?.(itemToDelete.value.id)
    showToast(`${props.config.entityName} deleted successfully!`, 'success')
    showDeleteModal.value = false
    itemToDelete.value = null
  } catch (error) {
    showToast(`Failed to delete ${props.config.entityName.toLowerCase()}`, 'error')
  }
}

const showToast = (message, type) => {
  toast.value = { show: true, message, type }
}

const closeToast = () => {
  toast.value.show = false
}

// Get display name for the item
const getItemDisplayName = (item) => {
  return item[props.config.searchField] || item.title || item.name || 'Item'
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-200">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 shadow-xl">
          <div class="relative z-10">
            <h1 class="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {{ config.icon }} Manage {{ config.entityNamePlural }}
            </h1>
            <p class="text-indigo-100 text-lg">
              Create, edit, and organize your {{ config.entityNamePlural.toLowerCase() }}
            </p>
          </div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        </div>
      </div>

      <!-- Filters & Actions -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 transition-colors duration-200">
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <!-- Search -->
          <div :class="config.filterField ? 'lg:col-span-2' : 'lg:col-span-3'">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              🔍 Search by {{ config.searchField }}
            </label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                :placeholder="`Search ${config.entityNamePlural.toLowerCase()}...`"
                class="w-full px-4 py-3 pl-11 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
              <svg class="w-5 h-5 absolute left-3 top-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Filter (if configured) -->
          <div v-if="config.filterField && filterOptions.length > 0">
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              ✍️ Filter by {{ config.filterLabel }}
            </label>
            <select
              v-model="selectedFilter"
              class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
            >
              <option value="">All {{ config.filterLabel }}s</option>
              <option
                v-for="option in filterOptions"
                :key="option.id"
                :value="option.id"
              >
                {{ config.getFilterOptionLabel(option) }}
              </option>
            </select>
          </div>

          <!-- Create Button -->
          <div class="flex items-end">
            <button
              @click="goToCreate"
              class="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add New {{ config.entityName }}
            </button>
          </div>
        </div>

        <!-- View Toggle -->
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end">
          <div class="flex gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              @click="viewMode = 'grid'"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                viewMode === 'grid' 
                  ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                viewMode === 'list' 
                  ? 'bg-white dark:bg-gray-600 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
              ]"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="store.loading" class="flex justify-center items-center py-20">
        <div class="relative">
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
          <div class="animate-spin rounded-full h-16 w-16 border-4 border-indigo-600 dark:border-indigo-400 border-t-transparent absolute top-0 left-0"></div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredItems.length === 0"
        class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-12 text-center border border-gray-200 dark:border-gray-700 transition-colors duration-200"
      >
        <div class="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
          <span class="text-6xl">{{ config.icon }}</span>
        </div>
        <h3 class="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
          No {{ config.entityNamePlural.toLowerCase() }} found
        </h3>
        <p class="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
          {{ searchQuery || selectedFilter 
            ? 'Try adjusting your filters to find what you\'re looking for' 
            : `Start by adding your first ${config.entityName.toLowerCase()}` 
          }}
        </p>
        <button
          v-if="!searchQuery && !selectedFilter"
          @click="goToCreate"
          class="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Add Your First {{ config.entityName }}
        </button>
      </div>

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 transform hover:-translate-y-1"
        >
          <!-- Card Content (use slot for custom rendering) -->
          <slot name="grid-card" :item="item" :goToEdit="goToEdit" :confirmDelete="confirmDelete">
            <!-- Default card with image support -->
            <!-- Image/Cover Section -->
            <div v-if="item.coverUrl || item.avatarUrl" class="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
              <img
                :src="item.coverUrl || item.avatarUrl"
                :alt="getItemDisplayName(item)"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div class="absolute top-3 right-3 flex gap-2">
                <button
                  @click="goToEdit(item.id)"
                  class="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-indigo-600 dark:text-indigo-400 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg hover:scale-110"
                  title="Edit"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="confirmDelete(item)"
                  class="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-red-600 dark:text-red-400 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all shadow-lg hover:scale-110"
                  title="Delete"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Content Section -->
            <div class="p-5">
              <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">
                {{ getItemDisplayName(item) }}
              </h3>

              <!-- Render columns -->
              <div class="space-y-2">
                <div v-for="column in config.columns.slice(1)" :key="column.key" class="text-sm">
                  <span class="text-gray-500 dark:text-gray-400">{{ column.label }}:</span>
                  <span class="ml-2 font-medium text-gray-700 dark:text-gray-300">
                    <template v-if="column.type === 'tags'">
                      <div class="flex flex-wrap gap-1 mt-1">
                        <span
                          v-for="(tag, idx) in getColumnValue(item, column).slice(0, 3)"
                          :key="idx"
                          class="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs rounded-full"
                        >
                          {{ tag }}
                        </span>
                        <span
                          v-if="getColumnValue(item, column).length > 3"
                          class="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full"
                        >
                          +{{ getColumnValue(item, column).length - 3 }}
                        </span>
                      </div>
                    </template>
                    <template v-else>
                      {{ getColumnValue(item, column) }}
                    </template>
                  </span>
                </div>
              </div>
            </div>
          </slot>
                
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-4">
        <div
          v-for="item in filteredItems"
          :key="item.id"
          class="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700 overflow-hidden"
        >
          <slot name="list-row" :item="item" :goToEdit="goToEdit" :confirmDelete="confirmDelete">
            <!-- Default list row with image -->
            <div class="flex gap-6 p-6">
              <!-- Image/Avatar -->
              <div v-if="item.coverUrl || item.avatarUrl" class="flex-shrink-0">
                <img
                  :src="item.coverUrl || item.avatarUrl"
                  :alt="getItemDisplayName(item)"
                  :class="item.avatarUrl ? 'w-20 h-20 rounded-full' : 'w-28 h-36 rounded-xl'"
                  class="object-cover shadow-md group-hover:shadow-lg transition-shadow"
                />
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex justify-between items-start gap-4 mb-3">
                  <h3 class="font-bold text-xl text-gray-900 dark:text-gray-100">
                    {{ getItemDisplayName(item) }}
                  </h3>

                  <!-- Actions -->
                  <div class="flex gap-2 flex-shrink-0">
                    <button
                      @click="goToEdit(item.id)"
                      class="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-all"
                      title="Edit"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="confirmDelete(item)"
                      class="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
                      title="Delete"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Columns -->
                <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div v-for="column in config.columns.slice(1)" :key="column.key" class="text-sm">
                    <span class="text-gray-500 dark:text-gray-400 block mb-1">{{ column.label }}</span>
                    <span class="font-semibold text-gray-700 dark:text-gray-300">
                      <template v-if="column.type === 'tags'">
                        <div class="flex flex-wrap gap-1">
                          <span
                            v-for="(tag, idx) in getColumnValue(item, column)"
                            :key="idx"
                            class="px-2 py-1 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs rounded-full"
                          >
                            {{ tag }}
                          </span>
                        </div>
                      </template>
                      <template v-else>
                        {{ getColumnValue(item, column) }}
                      </template>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </slot>
        </div>
      </div>
    </div>

    <!-- Delete Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showDeleteModal"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
        @click.self="cancelDelete"
      >
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-gray-200 dark:border-gray-700">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-2xl flex items-center justify-center">
              <svg class="w-7 h-7 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100">Delete {{ config.entityName }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400">This action cannot be undone</p>
            </div>
          </div>

          <p class="text-gray-700 dark:text-gray-300 mb-8">
            Are you sure you want to permanently delete
            <span class="font-bold text-gray-900 dark:text-gray-100">
              "{{ itemToDelete ? getItemDisplayName(itemToDelete) : '' }}"
            </span>?
          </p>

          <div class="flex gap-3">
            <button
              @click="cancelDelete"
              class="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              @click="deleteItem"
              class="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast -->
    <Toast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
      @close="closeToast"
    />
  </div>
</template>