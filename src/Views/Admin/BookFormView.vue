<script setup>
import { useBooksStore } from '@/stores/useBooksStore'
import { useAuthorsStore } from '@/stores/useAuthorsStore'
import GeneralForm from '@/components/GeneralForm.vue'

const booksStore = useBooksStore()
const authorsStore = useAuthorsStore()

const bookFormConfig = {
  entityName: 'Book',
  entityNamePlural: 'Books',
  icon: '📚',
  basePath: '/admin/books',
  fields: [
    {
      key: 'title',
      label: 'Title',
      type: 'text',
      required: true,
      minLength: 3,
      maxLength: 100,
      icon: '📖'
    },
    {
      key: 'authorId',
      label: 'Author',
      type: 'select',
      required: true,
      validateExists: true,
      options: (relatedStore) => relatedStore.authors,
      optionLabel: (opt) => opt.name,
      icon: '✍️'
    },
    {
      key: 'year',
      label: 'Publication Year',
      type: 'number',
      required: true,
      min: 1800,
      max: () => new Date().getFullYear(),
      icon: '📅'
    },
    {
      key: 'tags',
      label: 'Tags',
      type: 'tags',
      maxItems: 8,
      minLength: 2,
      maxLength: 20,
      icon: '🏷️'
    },
    {
      key: 'coverUrl',
      label: 'Cover Image URL',
      type: 'url',
      icon: '🖼️'
    },
    {
      key: 'description',
      label: 'Description',
      type: 'textarea',
      maxLength: 2000,
      rows: 6,
      icon: '📝'
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