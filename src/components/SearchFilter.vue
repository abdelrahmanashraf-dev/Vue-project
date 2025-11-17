<template>
  <div class="flex flex-col md:flex-row gap-4 mb-6">
    <!-- Search Input -->
    <div class="form-control flex-1">
      <input 
        :value="searchQuery" 
        @input="$emit('update:searchQuery', $event.target.value)"
        type="text" 
        :placeholder="searchPlaceholder"
        class="input input-bordered w-full"
      />
    </div>

    <!-- Additional Filters Slot -->
    <slot name="filters"></slot>

    <!-- Clear Button -->
    <div class="form-control">
      <button @click="$emit('clear')" class="btn btn-outline mt-auto">
        {{ clearButtonText }}
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },
  clearButtonText: {
    type: String,
    default: 'Clear Filters'
  }
});

defineEmits(['update:searchQuery', 'clear']);
</script>