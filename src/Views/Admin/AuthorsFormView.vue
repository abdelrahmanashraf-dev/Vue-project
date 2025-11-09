<script setup>
import { useAuthorsStore } from '@/stores/useAuthorsStore'
import GeneralForm from '@/components/GeneralForm.vue'

const authorsStore = useAuthorsStore()

const authorFormConfig = {
  entityName: 'Author',
  entityNamePlural: 'Authors',
  icon: '✍️',
  basePath: '/admin/authors',
  fields: [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 60,
      icon: '👤'
    },
    {
      key: 'bio',
      label: 'Biography',
      type: 'textarea',
      maxLength: 800,
      rows: 5,
      icon: '📝'
    },
    {
      key: 'avatarUrl',
      label: 'Avatar Image URL',
      type: 'url',
      icon: '🖼️'
    }
  ]
}
</script>

<template>
  <GeneralForm
    :store="authorsStore"
    :config="authorFormConfig"
  />
</template>