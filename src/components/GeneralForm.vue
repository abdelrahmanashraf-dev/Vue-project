<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue'
import EmptyState from '@/components/Ui/EmptyState.vue'
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
  }
})

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

const isEditMode = computed(() => !!route.params.id)
const pageTitle = computed(() => 
  isEditMode.value ? `Edit ${props.config.entityName}` : `Add New ${props.config.entityName}`
)

// Initialize form
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
const originalForm = ref({})
const errors = ref({})
const tagInput = ref('')
const submitting = ref(false)
const loading = ref(false)
const loadError = ref(null)
const imagePreview = ref({})
const imageLoading = ref({})

// Load data on mount
onMounted(async () => {
  loading.value = true
  loadError.value = null
  
  try {
    // Load related data (authors/books)
    if (props.relatedStore) {
      await props.relatedStore.fetchAuthors?.() || await props.relatedStore.fetchBooks?.()
    }

    // Load item for edit mode
    if (isEditMode.value) {
      await loadItem()
    }
  } catch (error) {
    loadError.value = `Failed to load ${props.config.entityName.toLowerCase()} data`
  } finally {
    loading.value = false
  }
})

const loadItem = async () => {
  try {
    await props.store.fetchBookById?.(route.params.id) || 
          await props.store.fetchAuthorById?.(route.params.id)
    
    const item = props.store.selectedBook || props.store.selectedAuthor

    if (item) {
      props.config.fields.forEach(field => {
        if (field.type === 'tags' && Array.isArray(item[field.key])) {
          form.value[field.key] = [...item[field.key]]
          originalForm.value[field.key] = [...item[field.key]]
        } else {
          form.value[field.key] = item[field.key]
          originalForm.value[field.key] = item[field.key]
        }
        
        // Load image preview for existing URLs
        if (field.type === 'url' && item[field.key]) {
          imagePreview.value[field.key] = item[field.key]
        }
      })
      
      await Promise.all(
        props.config.fields.map(field => validateField(field))
      )
    } else {
      throw new Error('Item not found')
    }
  } catch (error) {
    throw error
  }
}

const retryLoad = async () => {
  loading.value = true
  loadError.value = null
  
  try {
    if (props.relatedStore) {
      await props.relatedStore.fetchAuthors?.() || await props.relatedStore.fetchBooks?.()
    }
    
    if (isEditMode.value) {
      await loadItem()
    }
  } catch (error) {
    loadError.value = `Failed to load ${props.config.entityName.toLowerCase()} data`
  } finally {
    loading.value = false
  }
}

// Image handling
const handleImageUpload = (field, event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  if (!validTypes.includes(file.type)) {
    errors.value[field.key] = 'Please upload a valid image file (jpg, png, gif, webp, svg)'
    return
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    errors.value[field.key] = 'Image size must be less than 5MB'
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value[field.key] = e.target.result
    form.value[field.key] = e.target.result
    errors.value[field.key] = ''
  }
  reader.readAsDataURL(file)
}

const loadImagePreview = async (field, url) => {
  if (!url) {
    imagePreview.value[field.key] = null
    return
  }

  imageLoading.value[field.key] = true
  imagePreview.value[field.key] = url
  
  // Test if image loads
  const img = new Image()
  img.onload = () => {
    imageLoading.value[field.key] = false
  }
  img.onerror = () => {
    imageLoading.value[field.key] = false
    imagePreview.value[field.key] = null
    errors.value[field.key] = 'Failed to load image from URL'
  }
  img.src = url
}

const clearImage = (field) => {
  form.value[field.key] = ''
  imagePreview.value[field.key] = null
  errors.value[field.key] = ''
}

// Validation
const validateField = async (field) => {
  const value = form.value[field.key]
  
  if (field.required && !value) {
    errors.value[field.key] = `${field.label} is required`
    return false
  }

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
    // Allow base64 images from upload
    if (value.startsWith('data:image/')) {
      errors.value[field.key] = ''
      return true
    }

    const isAbsoluteUrl = value.startsWith('http://') || value.startsWith('https://')
    const isLocalPath = value.startsWith('/') || value.startsWith('./') || value.startsWith('../')
    
    if (isAbsoluteUrl) {
      try {
        new URL(value)
        // Try to load the image to validate it
        imageLoading.value[field.key] = true
        const img = new Image()
        
        const loadPromise = new Promise((resolve, reject) => {
          img.onload = () => {
            imagePreview.value[field.key] = value
            imageLoading.value[field.key] = false
            errors.value[field.key] = ''
            resolve(true)
          }
          img.onerror = () => {
            imageLoading.value[field.key] = false
            imagePreview.value[field.key] = null
            errors.value[field.key] = 'Unable to load image from this URL. Please use a direct image link.'
            reject(false)
          }
          // Set timeout
          setTimeout(() => {
            imageLoading.value[field.key] = false
            reject(false)
          }, 10000)
        })
        
        img.src = value
        
        try {
          await loadPromise
          return true
        } catch {
          return false
        }
      } catch {
        errors.value[field.key] = 'Please enter a valid URL'
        return false
      }
    } else if (isLocalPath) {
      // For local paths, check extension
      const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i
      if (!imageExtensions.test(value)) {
        errors.value[field.key] = 'Path must end with a valid image extension'
        return false
      }
      // Load preview for local paths
      await loadImagePreview(field, value)
    } else {
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

// Watch for field changes
props.config.fields.forEach(field => {
  if (field.type !== 'tags' && field.type !== 'url') {
    watch(() => form.value[field.key], () => validateField(field))
  }
  
  // Watch URL fields for preview
  if (field.type === 'url') {
    watch(() => form.value[field.key], (newVal) => {
      if (newVal && !newVal.startsWith('data:image/')) {
        loadImagePreview(field, newVal)
      }
      validateField(field)
    })
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

// Check if form has been modified for edit mode
const isFormModified = computed(() => {
  if (!isEditMode.value) return true 
  
  // Compare current form with original
  for (const field of props.config.fields) {
    const currentValue = form.value[field.key]
    const originalValue = originalForm.value[field.key]
    
    // Handle arrays (tags)
    if (Array.isArray(currentValue)) {
      if (JSON.stringify(currentValue) !== JSON.stringify(originalValue)) {
        return true
      }
    } else if (currentValue !== originalValue) {
      return true
    }
  }
  
  return false
})

// Form validation
const isFormValid = computed(() => {
  // Check all required fields are filled
  for (const field of props.config.fields) {
    const value = form.value[field.key]
    
    if (field.required) {
      if (!value || (Array.isArray(value) && value.length === 0)) {
        return false
      }
      // For text fields, check if not just whitespace
      if ((field.type === 'text' || field.type === 'textarea') && typeof value === 'string') {
        if (!value.trim()) {
          return false
        }
      }
    }
    
    // Check for validation errors
    if (errors.value[field.key]) {
      return false
    }
    
    // Validate text length
    if ((field.type === 'text' || field.type === 'textarea') && value) {
      if (field.minLength && value.length < field.minLength) return false
      if (field.maxLength && value.length > field.maxLength) return false
    }
    
    // Validate number range
    if (field.type === 'number') {
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

// Submit form
const submitForm = async () => {
  const validations = await Promise.all(
    props.config.fields.map(field => validateField(field))
  )

  if (!validations.every(v => v)) {
    showToast('Please fix all errors before submitting', 'error')
    return
  }

  if (props.config.checkDuplicate) {
    const duplicateError = await props.config.checkDuplicate(
      form.value,
      props.store,
      isEditMode.value ? route.params.id : null
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
    
    props.config.fields.forEach(field => {
      if (field.type === 'number') {
        itemData[field.key] = parseInt(itemData[field.key])
      }
      if (field.type === 'select' && field.key.includes('Id')) {
        itemData[field.key] = parseInt(itemData[field.key])
      }
    })

    if (isEditMode.value) {
      const existingItem = props.store.selectedBook || props.store.selectedAuthor
      itemData.id = existingItem?.id
      itemData.createdAt = existingItem?.createdAt
      itemData.updatedAt = new Date().toISOString()
    } else {
      delete itemData.id
      itemData.createdAt = new Date().toISOString()
      itemData.updatedAt = new Date().toISOString()
    }

    if (isEditMode.value) {
      await props.store.updateBook?.(route.params.id, itemData) ||
            await props.store.updateAuthor?.(route.params.id, itemData)
      showToast(`${props.config.entityName} updated successfully!`, 'success')
    } else {
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
</script>

<template>
  <div data-theme="papyrus" class="min-h-screen transition-colors duration-200">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <button
          @click="cancel"
          class="btn btn-ghost gap-2 mb-6"
        >
          <i class="fas fa-arrow-left"></i>
          Back to {{ config.entityNamePlural }}
        </button>
        
        <div class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-secondary to-accent p-8 shadow-xl">
          <div class="relative z-10">
            <h1 class="text-4xl font-bold text-primary-content mb-2 drop-shadow-lg">
              <i :class="isEditMode ? 'fas fa-edit text-secondary' : 'fas fa-plus-circle text-accent'"></i>
              {{ pageTitle }}
            </h1>
            <p class="text-primary-content/90 text-lg">
              {{ isEditMode 
                ? `Update the ${config.entityName.toLowerCase()} information below` 
                : `Fill in the details to add a new ${config.entityName.toLowerCase()}` 
              }}
            </p>
          </div>
          <div class="absolute top-0 right-0 w-64 h-64 bg-base-100 opacity-10 rounded-full -mr-32 -mt-32"></div>
          <div class="absolute bottom-0 left-0 w-48 h-48 bg-base-100 opacity-10 rounded-full -ml-24 -mb-24"></div>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner 
        v-if="loading"
        :message="`Loading ${config.entityName.toLowerCase()} data...`"
        subtext="Please wait"
        size="lg"
      />

      <!-- Error State -->
      <EmptyState
        v-else-if="loadError"
        icon="fas fa-exclamation-triangle"
        icon-color="error"
        :title="`Failed to Load ${config.entityName}`"
        :description="loadError"
        action-text="Try Again"
        action-icon="fas fa-redo"
        action-button-class="btn-error"
        :show-default-action="true"
        @action="retryLoad"
      >
        <template #actions>
          <button @click="retryLoad" class="btn btn-error gap-2">
            <i class="fas fa-redo"></i>
            Try Again
          </button>
          <button @click="cancel" class="btn btn-ghost gap-2">
            <i class="fas fa-arrow-left"></i>
            Go Back
          </button>
        </template>
      </EmptyState>

      <!-- Form -->
      <form v-else @submit.prevent="submitForm" class="card bg-base-100 shadow-xl p-8 border border-base-300">
        <div class="space-y-6">
          <div
            v-for="field in config.fields"
            :key="field.key"
            :class="field.type === 'tags' ? 'col-span-full' : ''"
          >
            <!-- Text Input -->
            <div v-if="field.type === 'text'" class="form-control">
              <label class="label">
                <span class="label-text font-bold">
                  <i :class="[field.icon, 'text-primary mr-2']"></i>{{ field.label }}
                  <span v-if="field.required" class="text-error">*</span>
                </span>
              </label>
              <input
                v-model="form[field.key]"
                type="text"
                :placeholder="`Enter ${field.label.toLowerCase()}`"
                class="input input-bordered"
                :class="errors[field.key] ? 'input-error' : ''"
                @blur="validateField(field)"
              />
              <label class="label">
                <span v-if="errors[field.key]" class="label-text-alt text-error">
                  {{ errors[field.key] }}
                </span>
                <span v-if="field.maxLength" class="label-text-alt">
                  {{ form[field.key].length }}/{{ field.maxLength }}
                </span>
              </label>
            </div>

            <!-- Number Input -->
            <div v-else-if="field.type === 'number'" class="form-control">
              <label class="label">
                <span class="label-text font-bold">
                  <i :class="[field.icon, 'text-secondary mr-2']"></i>{{ field.label }}
                  <span v-if="field.required" class="text-error">*</span>
                </span>
              </label>
              <input
                v-model.number="form[field.key]"
                type="number"
                :min="field.min"
                :max="typeof field.max === 'function' ? field.max() : field.max"
                class="input input-bordered"
                :class="errors[field.key] ? 'input-error' : ''"
                @blur="validateField(field)"
              />
              <label v-if="errors[field.key]" class="label">
                <span class="label-text-alt text-error">{{ errors[field.key] }}</span>
              </label>
            </div>

            <!-- Select -->
            <div v-else-if="field.type === 'select'" class="form-control">
              <label class="label">
                <span class="label-text font-bold">
                  <i :class="[field.icon, 'text-accent mr-2']"></i>{{ field.label }}
                  <span v-if="field.required" class="text-error">*</span>
                </span>
              </label>
              <select
                v-model="form[field.key]"
                class="select select-bordered"
                :class="errors[field.key] ? 'select-error' : ''"
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
              <label v-if="errors[field.key]" class="label">
                <span class="label-text-alt text-error">{{ errors[field.key] }}</span>
              </label>
            </div>

            <!-- Tags -->
            <div v-else-if="field.type === 'tags'" class="form-control">
              <label class="label">
                <span class="label-text font-bold">
                  <i :class="[field.icon, 'text-primary mr-2']"></i>{{ field.label }}
                  <span v-if="field.maxItems">(Max {{ field.maxItems }})</span>
                  <span v-if="field.required" class="text-error">*</span>
                </span>
              </label>
              <div class="join">
                <input
                  v-model="tagInput"
                  type="text"
                  :placeholder="`Add a ${field.label.toLowerCase().slice(0, -1)}`"
                  class="input input-bordered join-item flex-1"
                  @keyup.enter="addTag(field)"
                />
                <button
                  type="button"
                  @click="addTag(field)"
                  :disabled="field.maxItems && form[field.key].length >= field.maxItems"
                  class="btn btn-primary join-item"
                >
                  <i class="fas fa-plus mr-1"></i> Add
                </button>
              </div>

              <div v-if="form[field.key].length > 0" class="flex flex-wrap gap-2 mt-3 p-4 bg-base-200 rounded-lg">
                <div
                  v-for="(tag, idx) in form[field.key]"
                  :key="idx"
                  class="badge badge-primary gap-2"
                >
                  {{ tag }}
                  <button type="button" @click="removeTag(field, idx)" class="btn btn-ghost btn-xs btn-circle">
                    <i class="fas fa-times text-xs"></i>
                  </button>
                </div>
              </div>

              <label class="label">
                <span v-if="errors[field.key]" class="label-text-alt text-error">{{ errors[field.key] }}</span>
                <span class="label-text-alt">{{ form[field.key].length }}/{{ field.maxItems || '∞' }}</span>
              </label>
            </div>

            <!-- Textarea -->
            <div v-else-if="field.type === 'textarea'" class="form-control">
              <label class="label">
                <span class="label-text font-bold">
                  <i :class="[field.icon, 'text-secondary mr-2']"></i>{{ field.label }}
                  <span v-if="field.required" class="text-error">*</span>
                </span>
              </label>
              <textarea
                v-model="form[field.key]"
                :rows="field.rows || 4"
                :placeholder="`Enter ${field.label.toLowerCase()}`"
                class="textarea textarea-bordered"
                :class="errors[field.key] ? 'textarea-error' : ''"
                @blur="validateField(field)"
              ></textarea>
              <label class="label">
                <span v-if="errors[field.key]" class="label-text-alt text-error">{{ errors[field.key] }}</span>
                <span v-if="field.maxLength" class="label-text-alt">
                  {{ form[field.key].length }}/{{ field.maxLength }}
                </span>
              </label>
            </div>

            <!-- URL with Upload and Preview -->
            <div v-else-if="field.type === 'url'" class="form-control">
              <label class="label">
                <span class="label-text font-bold">
                  <i :class="[field.icon, 'text-accent mr-2']"></i>{{ field.label }}
                  <span v-if="field.required" class="text-error">*</span>
                </span>
              </label>

              <!-- URL Input -->
              <div class="relative">
                <input
                  v-model="form[field.key]"
                  type="text"
                  placeholder="Paste direct image URL here..."
                  class="input input-bordered w-full pr-10"
                  :class="errors[field.key] ? 'input-error' : ''"
                  @blur="validateField(field)"
                />
                <button
                  v-if="form[field.key]"
                  type="button"
                  @click="validateField(field)"
                  class="btn btn-ghost btn-sm btn-circle absolute right-2 top-1/2 -translate-y-1/2"
                  title="Test image URL"
                >
                  <i class="fas fa-check-circle text-success"></i>
                </button>
              </div>

              

              <!-- Upload Button -->
              <div class="mt-2">
                <label class="btn btn-outline btn-sm gap-2">
                  <i class="fas fa-upload"></i>
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleImageUpload(field, $event)"
                  />
                </label>
                <button
                  v-if="form[field.key]"
                  type="button"
                  @click="clearImage(field)"
                  class="btn btn-ghost btn-sm gap-2 ml-2"
                >
                  <i class="fas fa-times"></i>
                  Clear
                </button>
              </div>

              <!-- Image Preview -->
              <div v-if="imagePreview[field.key]" class="mt-4 p-4 bg-base-200 rounded-lg">
                <p class="text-sm font-semibold mb-2">Preview:</p>
                <div class="relative w-full max-w-xs mx-auto">
                  <div v-if="imageLoading[field.key]" class="flex items-center justify-center h-48 bg-base-300 rounded-lg">
                    <span class="loading loading-spinner loading-lg"></span>
                  </div>
                  <img
                    v-else
                    :src="imagePreview[field.key]"
                    :alt="field.label"
                    class="w-full h-auto rounded-lg shadow-lg"
                    @error="imagePreview[field.key] = null"
                  />
                </div>
              </div>

              <label class="label">
                <span v-if="errors[field.key]" class="label-text-alt text-error flex items-center gap-1">
                  <i class="fas fa-exclamation-circle"></i>
                  {{ errors[field.key] }}
                </span>
                <span v-else-if="imagePreview[field.key] && !imageLoading[field.key]" class="label-text-alt text-success flex items-center gap-1">
                  <i class="fas fa-check-circle"></i>
                  Image loaded successfully
                </span>
                <span v-else class="label-text-alt text-base-content/60">
                  Or upload from your device (Max 5MB)
                </span>
              </label>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="card-actions justify-end mt-8 pt-8 border-t border-base-300">
          <button
            type="button"
            @click="cancel"
            class="btn btn-ghost"
          >
            <i class="fas fa-times mr-1"></i> Cancel
          </button>
          <button
            type="submit"
            :disabled="!isFormValid || !isFormModified || submitting"
            class="btn btn-primary"
          >
            <span v-if="submitting" class="loading loading-spinner loading-sm"></span>
            <i v-else :class="isEditMode ? 'fas fa-save' : 'fas fa-plus'" class="mr-1"></i>
            <span v-if="submitting">{{ isEditMode ? 'Updating...' : 'Creating...' }}</span>
            <span v-else>{{ isEditMode ? `Update ${config.entityName}` : `Create ${config.entityName}` }}</span>
          </button>
        </div>

        <!-- Alerts -->
        <div v-if="!isFormValid" class="alert alert-warning mt-6">
          <i class="fas fa-exclamation-triangle text-2xl"></i>
          <span>Please fill in all required fields marked with <span class="text-error">*</span></span>
        </div>
        
        <div v-if="isEditMode && isFormValid && !isFormModified" class="alert alert-info mt-6">
          <i class="fas fa-info-circle text-2xl"></i>
          <span>No changes made to update</span>
        </div>
      </form>
    </div>
  </div>
</template>