<script setup>
import { useBooksStore } from '@/stores/useBooksStore'
import { useAuthorsStore } from '@/stores/useAuthorsStore'
import GeneralTable from '@/components/GeneralTable.vue'

const booksStore = useBooksStore()
const authorsStore = useAuthorsStore()

const booksConfig = {
  entityName: 'Book',
  entityNamePlural: 'Books',
  icon: '📚',
  basePath: '/admin/books',
  searchField: 'title',
  filterField: 'authorId',
  filterLabel: 'Author',
  getFilterOptions: (relatedStore) => relatedStore.authors,
  getFilterOptionLabel: (option) => option.name,
  columns: [
    { key: 'title', label: 'Title', type: 'text' },
    { 
      key: 'authorId', 
      label: 'Author', 
      type: 'relation',
      getLabel: (authorId, relatedStore) => {
        const author = relatedStore.authors.find(a => a.id == authorId)
        return author ? author.name : 'Unknown Author'
      }
    },
    { key: 'year', label: 'Year', type: 'number' },
    { key: 'tags', label: 'Tags', type: 'tags' }
  ]
}
</script>

<template>
  <GeneralTable
    :store="booksStore"
    :related-store="authorsStore"
    :config="booksConfig"
  />
</template>