<template>

  <div class="bg-base-100 shadow-md w-full max-w-md mx-auto rounded-xl flex flex-col xl:flex-row overflow-hidden min-w-0">
    
    
    <figure class="flex-shrink-0 w-full xl:w-48">
      <img
        :src="book.coverUrl"
        :alt="book.title"
        class="w-full h-64 xl:h-full object-cover"
      />
    </figure>

    
    <div class="p-4 xl:p-6 flex flex-col justify-between min-w-0">
      <div>
        
        <h2 class="text-lg xl:text-xl font-semibold text-primary text-left mb-1">
          {{ book.title }}
        </h2>
        
        <p class="text-sm text-secondary text-left mb-3">{{ book.year }}</p>

        
        <p class="text-sm text-base-content/70 text-left mb-4 break-words">
          {{ book.description }}
        </p>
      </div>

      <div class="flex justify-center">
        
        <router-link
          :to="'/books/' + book.id"
          class="btn btn-primary w-full xl:w-auto"
        >
          Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: "BookCard",
  props: {
    book: {
      type: Object,
      required: true,
    },
  },
};

</script>

<style scoped>

</style>