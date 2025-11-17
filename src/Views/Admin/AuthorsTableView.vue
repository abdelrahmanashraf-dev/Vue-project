<script setup>
import { useAuthorsStore } from '@/stores/useAuthorsStore'
import GeneralTable from '@/components/GeneralTable.vue'

const authorsStore = useAuthorsStore()

const authorsConfig = {
  entityName: 'Author',
  entityNamePlural: 'Authors',
  icon: 'fas fa-pen-fancy',
  basePath: '/admin/authors',
  searchField: 'name',
  columns: [
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'bio', label: 'Biography', type: 'text' }
  ]
}
</script>

<template>
  <GeneralTable
    :store="authorsStore"
    :config="authorsConfig"
  />
</template>