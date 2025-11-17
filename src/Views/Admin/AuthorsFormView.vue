<script setup>
import { useAuthorsStore } from '@/stores/useAuthorsStore'
import GeneralForm from '@/components/GeneralForm.vue'

const authorsStore = useAuthorsStore()

const authorFormConfig = {
  entityName: 'Author',
  entityNamePlural: 'Authors',
  icon: 'fas fa-pen-fancy',
  basePath: '/admin/authors',
  fields: [
    {
      key: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      minLength: 2,
      maxLength: 60,
      icon: 'fas fa-user'
    },
    {
      key: 'bio',
      label: 'Biography',
      type: 'textarea',
      required: true,
      maxLength: 800,
      rows: 5,
      icon: 'fas fa-file-alt'
    },
    {
      key: 'avatarUrl',
      label: 'Avatar Image URL',
      type: 'url',
      required: true,
      icon: 'fas fa-image'
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