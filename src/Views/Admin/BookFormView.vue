<script setup>
import { useBooksStore } from '@/stores/useBooksStore'
import { useAuthorsStore } from '@/stores/useAuthorsStore'
import GeneralForm from '@/components/GeneralForm.vue'

const booksStore = useBooksStore()
const authorsStore = useAuthorsStore()

const bookFormConfig = {
  entityName: 'Book',
  entityNamePlural: 'Books',
  icon: 'fas fa-book',
  basePath: '/admin/books',
  fields: [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 100,
      icon: 'fas fa-heading'
    },
    {
      key: 'authorId',
      label: 'Author',
      type: 'select',
      required: true,
      validateExists: true,
      options: (relatedStore) => relatedStore.authors,
      optionLabel: (opt) => opt.name,
      icon: 'fas fa-user-edit'
    },
    {
      key: 'year',
      label: 'Publication Year',
      type: 'number',
      required: true,
      min: 1800,
      max: () => new Date().getFullYear(),
      icon: 'fas fa-calendar'
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'tags',
      maxItems: 8,
      minLength: 2,
      maxLength: 20,
      icon: 'fas fa-tags'
    },
    {
      key: 'coverUrl',
      label: 'Cover Image URL',
      type: 'url',
      icon: 'fas fa-image'
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      maxLength: 2000,
      rows: 6,
      icon: 'fas fa-align-left'
    }
  ],
  checkDuplicate: async (form, store, itemId) => {
    const currentItemId = itemId ? parseInt(itemId) : null

    const duplicate = store.books.find(
      book => {
        const sameTitle = book.title.toLowerCase() === form.title.toLowerCase()
        const sameAuthor = book.authorId === parseInt(form.authorId)
        const differentBook = parseInt(book.id) !== currentItemId

        return sameTitle && sameAuthor && differentBook
      }
    )
    return duplicate ? 'This author already has a book with this title' : null
  }
}
</script>

<template>
  <GeneralForm
    :store="booksStore"
    :related-store="authorsStore"
    :config="bookFormConfig"
  />
</template>