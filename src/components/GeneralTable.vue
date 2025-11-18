<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Toast from '@/components/Ui/Toast.vue'
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue'
import EmptyState from '@/components/Ui/EmptyState.vue'
import SearchFilter from '@/components/SearchFilter.vue'
import Pagination from '@/components/Pagination.vue'

const props = defineProps({
  store: {
    type: Object,
    required: true
  },
  relatedStore: {
    type: Object,
    default: null
  },
  config: {
    type: Object,
    required: true
  }
})

const router = useRouter()

// State
const searchQuery = ref('')
const selectedFilter = ref('')
const showDeleteModal = ref(false)
const itemToDelete = ref(null)
const viewMode = ref('grid')
const currentPage = ref(1)
const itemsPerPage = ref(8) // 12 items per page for grid view

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

// Computed
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

// Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredItems.value.length / itemsPerPage.value)
})

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredItems.value.slice(start, end)
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

const clearFilters = () => {
  searchQuery.value = ''
  selectedFilter.value = ''
  currentPage.value = 1
}

const getItemDisplayName = (item) => {
  return item[props.config.searchField] || item.title || item.name || 'Item'
}

// Pagination handlers
const goToPage = (page) => {
  if (page !== '...') {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Reset page when filters change
const handleSearchChange = (value) => {
  searchQuery.value = value
  currentPage.value = 1
}

const handleFilterChange = () => {
  currentPage.value = 1
}
</script>

<template>
  <div data-theme="papyrus" class="min-h-screen transition-colors duration-200">
    <div class="container mx-auto px-4 py-8">
      
      <!-- Header -->
      <div class="mb-8">
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-8 shadow-xl">
          <div class="relative z-10">
            <h1 class="text-4xl font-bold text-primary-content mb-2 drop-shadow-lg">
              <i :class="[config.icon, 'mr-3']"></i>Manage {{ config.entityNamePlural }}
            </h1>
            <p class="text-primary-content/90 text-lg">
              Create, edit, and organize your {{ config.entityNamePlural.toLowerCase() }}
            </p>
          </div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-base-100 opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-base-100 opacity-10 rounded-full -ml-24 -mb-24"></div>
        </div>
      </div>

      <!-- Search & Filters using SearchFilter Component -->
      <div class="bg-base-100 rounded-2xl shadow-lg p-6 mb-6 border border-base-300 transition-colors duration-200">
        <div class="mb-4">
          <SearchFilter
            :search-query="searchQuery"
            @update:searchQuery="handleSearchChange"
            :search-placeholder="`Search ${config.entityNamePlural.toLowerCase()}...`"
            :clear-button-text="config.filterField && selectedFilter ? 'Clear Filters' : 'Clear Search'"
            @clear="clearFilters"
          >
            <template #filters>
              <!-- Filter by related entity -->
              <div v-if="config.filterField && filterOptions.length > 0" class="form-control flex-1">
                <select
                  v-model="selectedFilter"
                  @change="handleFilterChange"
                  class="select select-bordered w-full"
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

              <!-- Add New Button -->
              <div class="form-control">
                <button
                  @click="goToCreate"
                  class="btn btn-primary gap-2"
                >
                  <i class="fas fa-plus"></i>
                  Add {{ config.entityName }}
                </button>
              </div>
            </template>
          </SearchFilter>
        </div>

        <!-- View Mode Toggle -->
        <div class="pt-4 border-t border-base-300 flex items-center justify-between">
          <div class="text-sm text-base-content/60">
            Showing {{ paginatedItems.length }} of {{ filteredItems.length }} {{ config.entityNamePlural.toLowerCase() }}
          </div>
          <div class="btn-group">
            <button
              @click="viewMode = 'grid'"
              :class="['btn btn-sm', viewMode === 'grid' ? 'btn-active' : '']"
              title="Grid View"
            >
              <i class="fas fa-th"></i>
            </button>
            <button
              @click="viewMode = 'list'"
              :class="['btn btn-sm', viewMode === 'list' ? 'btn-active' : '']"
              title="List View"
            >
              <i class="fas fa-list"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner 
        v-if="store.loading"
        :message="`Loading ${config.entityNamePlural.toLowerCase()}...`"
        size="lg"
      />

      <!-- Empty State -->
      <EmptyState
        v-else-if="filteredItems.length === 0"
        :icon="config.icon || 'fas fa-folder-open'"
        icon-color="primary"
        :title="`No ${config.entityNamePlural} Found`"
        :description="searchQuery || selectedFilter 
          ? 'Try adjusting your filters to find what you\'re looking for' 
          : `No ${config.entityNamePlural.toLowerCase()} have been added yet. Start building your collection!`"
        :action-text="searchQuery || selectedFilter ? 'Clear Filters' : `Add ${config.entityName}`"
        :action-icon="searchQuery || selectedFilter ? 'fas fa-times' : 'fas fa-plus'"
        :show-default-action="true"
        @action="searchQuery || selectedFilter ? clearFilters() : goToCreate()"
      />

      <!-- Grid View -->
      <div v-else-if="viewMode === 'grid'">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div
            v-for="item in paginatedItems"
            :key="item.id"
            class="card bg-base-100 shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-300 transform hover:-translate-y-1"
          >
            <slot name="grid-card" :item="item" :goToEdit="goToEdit" :confirmDelete="confirmDelete">
              <!-- Image -->
              <div v-if="item.coverUrl || item.avatarUrl" class="relative h-48 overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
                <img
                  :src="item.coverUrl || item.avatarUrl"
                  :alt="getItemDisplayName(item)"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
                <div class="absolute top-3 right-3 flex gap-2">
                  <button
                    @click="goToEdit(item.id)"
                    class="btn btn-circle btn-sm btn-primary"
                    title="Edit"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click="confirmDelete(item)"
                    class="btn btn-circle btn-sm btn-error"
                    title="Delete"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </div>

              <!-- Content -->
              <div class="card-body">
                <h3 class="card-title text-base-content">
                  {{ getItemDisplayName(item) }}
                </h3>

                <!-- Columns -->
                <div class="space-y-2">
                  <div v-for="column in config.columns.slice(1)" :key="column.key" class="text-sm">
                    <span class="text-base-content/60">{{ column.label }}:</span>
                    <span class="ml-2 font-medium text-base-content">
                      <template v-if="column.type === 'tags'">
                        <div class="flex flex-wrap gap-1 mt-1">
                          <span
                            v-for="(tag, idx) in getColumnValue(item, column).slice(0, 3)"
                            :key="idx"
                            class="badge badge-primary badge-sm"
                          >
                            {{ tag }}
                          </span>
                          <span
                            v-if="getColumnValue(item, column).length > 3"
                            class="badge badge-ghost badge-sm"
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

        <!-- Pagination -->
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @prev="prevPage"
          @next="nextPage"
          @goto="goToPage"
        />
      </div>

      <!-- List View -->
      <div v-else>
        <div class="space-y-4">
          <div
            v-for="item in paginatedItems"
            :key="item.id"
            class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300"
          >
            <slot name="list-row" :item="item" :goToEdit="goToEdit" :confirmDelete="confirmDelete">
              <div class="flex gap-6 p-6">
                <!-- Image -->
                <div v-if="item.coverUrl || item.avatarUrl" class="flex-shrink-0">
                  <img
                    :src="item.coverUrl || item.avatarUrl"
                    :alt="getItemDisplayName(item)"
                    :class="item.avatarUrl ? 'w-20 h-20 rounded-full' : 'w-28 h-36 rounded-xl'"
                    class="object-cover shadow-md"
                  />
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex justify-between items-start gap-4 mb-3">
                    <h3 class="text-xl font-bold text-base-content">
                      {{ getItemDisplayName(item) }}
                    </h3>

                    <!-- Actions -->
                    <div class="flex gap-2 flex-shrink-0">
                      <button
                        @click="goToEdit(item.id)"
                        class="btn btn-primary btn-sm"
                        title="Edit"
                      >
                        <i class="fas fa-edit"></i>
                      </button>
                      <button
                        @click="confirmDelete(item)"
                        class="btn btn-error btn-sm"
                        title="Delete"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <!-- Columns -->
                  <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div v-for="column in config.columns.slice(1)" :key="column.key" class="text-sm">
                      <span class="text-base-content/60 block mb-1">{{ column.label }}</span>
                      <span class="font-semibold text-base-content">
                        <template v-if="column.type === 'tags'">
                          <div class="flex flex-wrap gap-1">
                            <span
                              v-for="(tag, idx) in getColumnValue(item, column)"
                              :key="idx"
                              class="badge badge-primary badge-sm"
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
        class="modal modal-open"
        @click.self="cancelDelete"
      >
        <div class="modal-box">
          <div class="flex items-center gap-4 mb-6">
            <div class="w-14 h-14 bg-error/20 rounded-2xl flex items-center justify-center">
              <i class="fas fa-exclamation-triangle text-3xl text-error"></i>
            </div>
            <div>
              <h3 class="font-bold text-xl text-base-content">Delete {{ config.entityName }}</h3>
              <p class="text-sm text-base-content/60">This action cannot be undone</p>
            </div>
          </div>

          <p class="text-base-content mb-8">
            Are you sure you want to permanently delete
            <span class="font-bold">
              "{{ itemToDelete ? getItemDisplayName(itemToDelete) : '' }}"
            </span>?
          </p>

          <div class="modal-action">
            <button
              @click="cancelDelete"
              class="btn btn-ghost"
            >
              <i class="fas fa-times mr-1"></i> Cancel
            </button>
            <button
              @click="deleteItem"
              class="btn btn-error"
            >
              <i class="fas fa-trash mr-1"></i> Delete
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