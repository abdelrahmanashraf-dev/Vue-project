<template>
  <div v-if="totalPages > 1" class="flex justify-center pt-6 gap-2">
    <button 
      @click="$emit('prev')" 
      :disabled="currentPage === 1" 
      class="btn"
    >
      «
    </button>
    
    <button 
      v-for="page in displayedPages"
      :key="page"
      class="btn" 
      :class="{ 'btn-active': page === currentPage }"
      @click="$emit('goto', page)"
      :disabled="page === '...'"
    >
      {{ page }}
    </button>
    
    <button 
      @click="$emit('next')" 
      :disabled="currentPage === totalPages" 
      class="btn"
    >
      »
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  maxDisplayed: {
    type: Number,
    default: 5
  }
});

defineEmits(['prev', 'next', 'goto']);

const displayedPages = computed(() => {
  const pages = [];
  const { totalPages, currentPage, maxDisplayed } = props;
  
  if (totalPages <= maxDisplayed) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push('...');
      pages.push(totalPages);
    }
  }
  
  return pages;
});
</script>