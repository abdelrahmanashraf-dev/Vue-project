<template>
  <div class="bg-[#f8f5f0] shadow-md w-full max-w-md mx-auto rounded-xl flex flex-col sm:flex-row overflow-hidden min-w-0">
    <figure class="flex-shrink-0 w-full sm:w-48">
      <img
        :src="book.coverUrl"
        :alt="book.title"
        class="w-full h-64 sm:h-full object-cover"
      />
      </figure>

    <div class="p-4 sm:p-6 flex flex-col justify-between">
      <div>
        <h2 class="text-lg sm:text-xl font-semibold text-[#d4af37] text-left mb-1">
          {{ book.title }}
        </h2>
        <p class="text-sm text-[#bfa76f] text-left mb-3">{{ book.year }}</p>

        <p class="text-sm text-gray-600 text-left mb-4">
          {{ book.description }}
        </p>
      </div>

      <div class="flex justify-center">
        <button class="bg-[#d4af37] hover:bg-[#c19e35] text-white font-medium py-2 px-8 sm:px-10 rounded-lg transition-colors duration-200 w-full sm:w-auto">
          Details
        </button>
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
      // ضفت default بسيط عشان لو بتجرب الكومبوننت لوحده
      default: () => ({
        coverUrl: 'https://via.placeholder.com/192x256',
        title: 'Book Title',
        year: '2025',
        description: 'This is a short description of the book.'
      })
    },
  },
};
</script>

<style scoped>
/* مفيش حاجة هنا حالياً، لكن ممكن تضيف أي ستايلات خاصة بالكومبوننت ده لو احتجت */
</style>