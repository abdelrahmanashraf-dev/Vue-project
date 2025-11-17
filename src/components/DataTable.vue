<template>
  <div>
    <!-- Loading State -->
    <LoadingSpinner 
      v-if="loading"
      :message="loadingMessage"
      :subtext="loadingSubtext"
      size="lg"
    />

    <!-- Error State -->
    <EmptyState
      v-else-if="error"
      icon="fas fa-exclamation-triangle"
      icon-color="error"
      title="Failed to Load Data"
      :description="error.message"
      action-text="Retry"
      action-icon="fas fa-redo"
      action-button-class="btn-error"
      :show-default-action="true"
      @action="$emit('retry')"
    />

    <!-- Data Table -->
    <div v-else-if="data.length">
      <div class="overflow-x-auto">
        <table class="table w-full table-zebra">
          <thead>
            <tr>
              <th v-for="column in columns" :key="column.key">
                {{ column.label }}
              </th>
              <th v-if="showActions">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in data" :key="item.id" class="hover">
              <td v-for="column in columns" :key="column.key">
                <slot :name="`cell-${column.key}`" :item="item" :value="item[column.key]">
                  {{ item[column.key] }}
                </slot>
              </td>
              <td v-if="showActions">
                <slot name="actions" :item="item">
                  <button 
                    @click="$emit('view-details', item.id)" 
                    class="btn btn-sm btn-primary px-4"
                  >
                    View Details
                  </button>
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- Empty State -->
    <EmptyState
      v-else
      :icon="emptyIcon"
      :icon-color="emptyIconColor"
      :title="emptyTitle"
      :description="emptyDescription"
      :action-text="emptyActionText"
      :action-icon="emptyActionIcon"
      :show-default-action="showEmptyAction"
      @action="$emit('empty-action')"
    >
      <template v-if="$slots['empty-actions']" #actions>
        <slot name="empty-actions"></slot>
      </template>
    </EmptyState>
  </div>
</template>

<script setup>
import LoadingSpinner from '@/components/Ui/LoadingSpinner.vue';
import EmptyState from '@/components/Ui/EmptyState.vue';

const props = defineProps({
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: null
  },
  showActions: {
    type: Boolean,
    default: true
  },
  loadingMessage: {
    type: String,
    default: 'Loading data...'
  },
  loadingSubtext: {
    type: String,
    default: 'Please wait'
  },
  emptyIcon: {
    type: String,
    default: 'fas fa-inbox'
  },
  emptyIconColor: {
    type: String,
    default: 'primary'
  },
  emptyTitle: {
    type: String,
    default: 'No Data Found'
  },
  emptyDescription: {
    type: String,
    default: 'No items available'
  },
  emptyActionText: {
    type: String,
    default: 'Add Item'
  },
  emptyActionIcon: {
    type: String,
    default: 'fas fa-plus'
  },
  showEmptyAction: {
    type: Boolean,
    default: false
  }
});

defineEmits(['view-details', 'retry', 'empty-action']);
</script>