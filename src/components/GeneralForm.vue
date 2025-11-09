<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Toast from '@/components/Ui/Toast.vue'
import AdminLayout from '../Layouts/AdminLayout.vue'
import axios from 'axios'

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
    // Example config:
    // {
    //   entityName: 'Book',
    //   entityNamePlural: 'Books',
    //   icon: '📚',
    //   basePath: '/admin/books',
    //   fields: [
    //     {
    //       key: 'title',
    //       label: 'Title',
    //       type: 'text',
    //       required: true,
    //       minLength: 3,
    //       maxLength: 100,
    //       icon: '📖'
    //     },
    //     {
    //       key: 'authorId',
    //       label: 'Author',
    //       type: 'select',
    //       required: true,
    //       validateExists: true, // check if ID exists via API
    //       options: (relatedStore) => relatedStore.authors,
    //       optionLabel: (opt) => opt.name,
    //       icon: '✍️'
    //     },
    //     {
    //       key: 'year',
    //       label: 'Year',
    //       type: 'number',
    //       required: true,
    //       min: 1800,
    //       max: () => new Date().getFullYear(),
    //       icon: '📅'
    //     },
    //     {
    //       key: 'tags',
    //       label: 'Tags',
    //       type: 'tags',
    //       maxItems: 8,
    //       minLength: 2,
    //       maxLength: 20,
    //       icon: '🏷️'
    //     },
    //     {
    //       key: 'description',
    //       label: 'Description',
    //       type: 'textarea',
    //       maxLength: 2000,
    //       rows: 6,
    //       icon: '📝'
    //     }
    //   ],
    //   checkDuplicate: async (form, store, itemId) => {
    //     // Custom duplicate check logic
    //     const dup = store.books.find(b => 
    //       b.title.toLowerCase() === form.title.toLowerCase() &&
    //       b.authorId === parseInt(form.authorId) &&
    //       b.id !== parseInt(itemId)
    //     )
    //     return dup ? 'This author already has a book with this title' : null
    //   }
    // }
  }
})

const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => 
  isEditMode.value ? `Edit ${props.config.entityName}` : `Add New ${props.config.entityName}`
)

// Initialize form with default values
const initForm = () => {
  const formData = {}
  props.config.fields.forEach(field => {
    if (field.type === 'tags') {
      formData[field.key] = []
    } else if (field.type === 'number') {
      formData[field.key] = field.default || (field.max ? (typeof field.max === 'function' ? field.max() : field.max) : 0)
    } else {
      formData[field.key] = field.default || ''
    }
  })
  return formData
}

const form = ref(initForm())
const errors = ref({})
const tagInput = ref('')
const submitting = ref(false)

const toast = ref({
  show: false,
  message: '',
  type: 'success'
})

onMounted(async () => {
  // Fetch related data if needed
  if (props.relatedStore) {
    await props.relatedStore.fetchAuthors?.() || await props.relatedStore.fetchBooks?.()
  }

  // Load item data in edit mode
  if (isEditMode.value) {
    await loadItem()
  }
})

const loadItem = async () => {
  try {
    // Call the appropriate fetch method
    await props.store.fetchBookById?.(route.params.id) || 
          await props.store.fetchAuthorById?.(route.params.id)
    
    const item = props.store.selectedBook || props.store.selectedAuthor

    if (item) {
      props.config.fields.forEach(field => {
        if (field.type === 'tags' && Array.isArray(item[field.key])) {
          form.value[field.key] = [...item[field.key]]
        } else {
          form.value[field.key] = item[field.key]
        }
      })
      
      // Validate all fields after loading to clear any errors
      // This ensures the form is valid when loaded with existing data
      await Promise.all(
        props.config.fields.map(field => validateField(field))
      )
    }
  } catch (error) {
    showToast(`Failed to load ${props.config.entityName.toLowerCase()}`, 'error')
    router.push(props.config.basePath)
  }
}

// Validation
const validateField = async (field) => {
  const value = form.value[field.key]
  
  // Required check
  if (field.required && !value) {
    errors.value[field.key] = `${field.label} is required`
    return false
  }

  // Type-specific validation
  if (field.type === 'text' || field.type === 'textarea') {
    if (field.minLength && value.length < field.minLength) {
      errors.value[field.key] = `${field.label} must be at least ${field.minLength} characters`
      return false
    }
    if (field.maxLength && value.length > field.maxLength) {
      errors.value[field.key] = `${field.label} must not exceed ${field.maxLength} characters`
      return false
    }
  }

  if (field.type === 'number') {
    const min = field.min
    const max = typeof field.max === 'function' ? field.max() : field.max
    
    if (min !== undefined && value < min) {
      errors.value[field.key] = `${field.label} must be at least ${min}`
      return false
    }
    if (max !== undefined && value > max) {
      errors.value[field.key] = `${field.label} must not exceed ${max}`
      return false
    }
  }

  if (field.type === 'url' && value) {
    // Accept both absolute URLs and local paths
    const isAbsoluteUrl = value.startsWith('http://') || value.startsWith('https://')
    const isLocalPath = value.startsWith('/') || value.startsWith('./') || value.startsWith('../')
    
    if (isAbsoluteUrl) {
      try {
        new URL(value)
      } catch {
        errors.value[field.key] = 'Please enter a valid URL'
        return false
      }
    } else if (!isLocalPath) {
      errors.value[field.key] = 'Please enter a valid URL or path (e.g., /images/cover.jpg)'
      return false
    }
  }

  if (field.type === 'tags') {
    const tags = form.value[field.key]
    if (field.maxItems && tags.length > field.maxItems) {
      errors.value[field.key] = `Maximum ${field.maxItems} tags allowed`
      return false
    }
    for (const tag of tags) {
      if (field.minLength && tag.length < field.minLength) {
        errors.value[field.key] = `Each tag must be at least ${field.minLength} characters`
        return false
      }
      if (field.maxLength && tag.length > field.maxLength) {
        errors.value[field.key] = `Each tag must not exceed ${field.maxLength} characters`
        return false
      }
    }
  }

  // Check if select value exists (validate via API)
  if (field.type === 'select' && field.validateExists && value) {
    try {
      const endpoint = field.validateEndpoint || `http://localhost:3000/${field.key.replace('Id', 's')}/${value}`
      const response = await axios.get(endpoint)
      if (response.status !== 200) {
        errors.value[field.key] = `Selected ${field.label.toLowerCase()} does not exist`
        return false
      }
    } catch (error) {
      if (error.response?.status === 404) {
        errors.value[field.key] = `Selected ${field.label.toLowerCase()} does not exist`
        return false
      }
    }
  }

  errors.value[field.key] = ''
  return true
}

// Watch all fields
props.config.fields.forEach(field => {
  if (field.type !== 'tags') {
    watch(() => form.value[field.key], () => validateField(field))
  }
})

// Tags management
const addTag = (field) => {
  const tag = tagInput.value.trim()
  if (!tag) return

  const tags = form.value[field.key]

  if (field.maxItems && tags.length >= field.maxItems) {
    errors.value[field.key] = `Maximum ${field.maxItems} tags allowed`
    return
  }

  if (field.minLength && tag.length < field.minLength) {
    errors.value[field.key] = `Tag must be at least ${field.minLength} characters`
    return
  }

  if (field.maxLength && tag.length > field.maxLength) {
    errors.value[field.key] = `Tag must not exceed ${field.maxLength} characters`
    return
  }

  if (tags.includes(tag)) {
    errors.value[field.key] = 'Tag already added'
    return
  }

  tags.push(tag)
  tagInput.value = ''
  errors.value[field.key] = ''
}

const removeTag = (field, index) => {
  form.value[field.key].splice(index, 1)
  errors.value[field.key] = ''
}

// Form validity
const isFormValid = computed(() => {
  // Check all required fields have values
  for (const field of props.config.fields) {
    const value = form.value[field.key]
    
    // Required field validation
    if (field.required) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return false
      }
    }
    
    // Check for errors
    if (errors.value[field.key]) {
      return false
    }
    
    // Basic length validations for text fields
    if ((field.type === 'text' || field.type === 'textarea') && value) {
      if (field.minLength && value.length < field.minLength) return false
      if (field.maxLength && value.length > field.maxLength) return false
    }
    
    // Number range validation
    if (field.type === 'number' && value) {
      const min = field.min
      const max = typeof field.max === 'function' ? field.max() : field.max
      if (min !== undefined && value < min) return false
      if (max !== undefined && value > max) return false
    }
  }
  
  return true
})

// Get select options
const getSelectOptions = (field) => {
  if (!field.options || !props.relatedStore) return []
  return field.options(props.relatedStore)
}

// Submit
const submitForm = async () => {
  // Validate all fields
  const validations = await Promise.all(
    props.config.fields.map(field => validateField(field))
  )

  if (!validations.every(v => v)) {
    showToast('Please fix all errors before submitting', 'error')
    return
  }

  // Check for duplicates if configured
  if (props.config.checkDuplicate) {
    const duplicateError = await props.config.checkDuplicate(
      form.value,
      props.store,
      route.params.id
    )
    if (duplicateError) {
      const firstField = props.config.fields[0].key
      errors.value[firstField] = duplicateError
      showToast('Please fix all errors before submitting', 'error')
      return
    }
  }

  submitting.value = true

  try {
    const itemData = { ...form.value }
    
    // Convert numeric fields
    props.config.fields.forEach(field => {
      if (field.type === 'number') {
        itemData[field.key] = parseInt(itemData[field.key])
      }
      if (field.type === 'select' && field.key.includes('Id')) {
        itemData[field.key] = parseInt(itemData[field.key])
      }
    })

    // Add timestamps (but NOT id - let the store handle it)
    if (isEditMode.value) {
      const existingItem = props.store.selectedBook || props.store.selectedAuthor
      itemData.id = existingItem?.id // Keep existing ID for updates
      itemData.createdAt = existingItem?.createdAt
      itemData.updatedAt = new Date().toISOString()
    } else {
      // DO NOT add id here - the store's addBook/addAuthor will handle it
      delete itemData.id // Remove if exists
      itemData.createdAt = new Date().toISOString()
      itemData.updatedAt = new Date().toISOString()
    }

    if (isEditMode.value) {
      await props.store.updateBook?.(route.params.id, itemData) ||
            await props.store.updateAuthor?.(route.params.id, itemData)
      showToast(`${props.config.entityName} updated successfully!`, 'success')
    } else {
      // The store will handle the refresh internally after adding
      await props.store.addBook?.(itemData) ||
            await props.store.addAuthor?.(itemData)
      
      showToast(`${props.config.entityName} created successfully!`, 'success')
    }

    setTimeout(() => {
      router.push(props.config.basePath)
    }, 1500)
  } catch (error) {
    showToast(`Failed to ${isEditMode.value ? 'update' : 'create'} ${props.config.entityName.toLowerCase()}`, 'error')
  } finally {
    submitting.value = false
  }
}

const cancel = () => {
  router.push(props.config.basePath)
}

const showToast = (message, type) => {
  toast.value = { show: true, message, type }
}

const closeToast = () => {
  toast.value.show = false
}
</script>

<template>
  <div class="min-h-screen transition-colors duration-200">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="cancel"
          class="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-all font-medium"
        >
          <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to {{ config.entityNamePlural }}
        </button>
        
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 shadow-xl">
          <div class="relative z-10">
            <h1 class="text-4xl font-bold text-white mb-2 drop-shadow-lg">
              {{ isEditMode ? '✏️' : '➕' }} {{ pageTitle }}
            </h1>
            <p class="text-indigo-100 text-lg">
              {{ isEditMode 
                ? `Update the ${config.entityName.toLowerCase()} information below` 
                : `Fill in the details to add a new ${config.entityName.toLowerCase()}` 
              }}
            </p>
          </div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full -ml-24 -mb-24"></div>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="submitForm" class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div class="space-y-6">
          <div
            v-for="field in config.fields"
            :key="field.key"
            :class="field.type === 'tags' ? 'col-span-full' : ''"
          >
            <!-- Text Input -->
            <div v-if="field.type === 'text'">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {{ field.icon }} {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <input
                v-model="form[field.key]"
                type="text"
                :placeholder="`Enter ${field.label.toLowerCase()}`"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                :class="errors[field.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                @blur="validateField(field)"
              />
              <div class="flex justify-between items-center mt-1">
                <p v-if="errors[field.key]" class="text-red-500 text-sm flex items-center gap-1">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
                  </svg>
                  {{ errors[field.key] }}
                </p>
                <p v-if="field.maxLength" class="text-gray-500 text-sm ml-auto">
                  {{ form[field.key].length }}/{{ field.maxLength }}
                </p>
              </div>
            </div>

            <!-- Number Input -->
            <div v-else-if="field.type === 'number'">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {{ field.icon }} {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <input
                v-model.number="form[field.key]"
                type="number"
                :min="field.min"
                :max="typeof field.max === 'function' ? field.max() : field.max"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                :class="errors[field.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                @blur="validateField(field)"
              />
              <p v-if="errors[field.key]" class="text-red-500 text-sm mt-1">{{ errors[field.key] }}</p>
            </div>

            <!-- Select -->
            <div v-else-if="field.type === 'select'">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {{ field.icon }} {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <select
                v-model="form[field.key]"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                :class="errors[field.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                @change="validateField(field)"
              >
                <option value="">Select {{ field.label.toLowerCase() }}</option>
                <option
                  v-for="option in getSelectOptions(field)"
                  :key="option.id"
                  :value="option.id"
                >
                  {{ field.optionLabel(option) }}
                </option>
              </select>
              <p v-if="errors[field.key]" class="text-red-500 text-sm mt-1">{{ errors[field.key] }}</p>
            </div>

            <!-- Tags -->
            <div v-else-if="field.type === 'tags'">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {{ field.icon }} {{ field.label }}
                <span v-if="field.maxItems">(Max {{ field.maxItems }})</span>
              </label>
              <div class="flex gap-2 mb-3">
                <input
                  v-model="tagInput"
                  type="text"
                  :placeholder="`Add a ${field.label.toLowerCase().slice(0, -1)}`"
                  class="flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                  @keyup.enter="addTag(field)"
                />
                <button
                  type="button"
                  @click="addTag(field)"
                  :disabled="field.maxItems && form[field.key].length >= field.maxItems"
                  class="px-6 py-3 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-all disabled:opacity-50"
                >
                  Add
                </button>
              </div>

              <div v-if="form[field.key].length > 0" class="flex flex-wrap gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 mb-2">
                <span
                  v-for="(tag, idx) in form[field.key]"
                  :key="idx"
                  class="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-semibold flex items-center gap-2"
                >
                  {{ tag }}
                  <button type="button" @click="removeTag(field, idx)" class="text-indigo-700 dark:text-indigo-300 hover:text-red-600 font-bold text-lg">×</button>
                </span>
              </div>

              <div class="flex justify-between">
                <p v-if="errors[field.key]" class="text-red-500 text-sm">{{ errors[field.key] }}</p>
                <p class="text-gray-500 text-sm ml-auto">{{ form[field.key].length }}/{{ field.maxItems || '∞' }}</p>
              </div>
            </div>

            <!-- Textarea -->
            <div v-else-if="field.type === 'textarea'">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {{ field.icon }} {{ field.label }}
              </label>
              <textarea
                v-model="form[field.key]"
                :rows="field.rows || 4"
                :placeholder="`Enter ${field.label.toLowerCase()}`"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-gray-900 dark:text-gray-100"
                :class="errors[field.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                @blur="validateField(field)"
              ></textarea>
              <div class="flex justify-between mt-1">
                <p v-if="errors[field.key]" class="text-red-500 text-sm">{{ errors[field.key] }}</p>
                <p v-if="field.maxLength" class="text-gray-500 text-sm ml-auto">
                  {{ form[field.key].length }}/{{ field.maxLength }}
                </p>
              </div>
            </div>

            <!-- URL -->
            <div v-else-if="field.type === 'url'">
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {{ field.icon }} {{ field.label }}
              </label>
              <input
                v-model="form[field.key]"
                type="url"
                :placeholder="`https://example.com/${field.label.toLowerCase()}.jpg`"
                class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-gray-100"
                :class="errors[field.key] ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'"
                @blur="validateField(field)"
              />
              <p v-if="errors[field.key]" class="text-red-500 text-sm mt-1">{{ errors[field.key] }}</p>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex gap-4 justify-end mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            @click="cancel"
            class="px-8 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || submitting"
            class="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all disabled:opacity-50"
          >
            <span v-if="submitting">{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
            <span v-else>{{ isEditMode ? `Update ${config.entityName}` : `Create ${config.entityName}` }}</span>
          </button>
        </div>

        <!-- Validation Warning -->
        <div v-if="!isFormValid && !isEditMode" class="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <p class="text-sm text-yellow-700 dark:text-yellow-400">
            Please fill in all required fields marked with <span class="text-red-500">*</span>
          </p>
        </div>
      </form>

      <Toast :show="toast.show" :message="toast.message" :type="toast.type" @close="closeToast" />
    </div>
  </div>
</template>