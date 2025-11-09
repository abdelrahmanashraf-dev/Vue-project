<template>
  <div
    class="bg-[#1a1a1a] text-[#e5d7b2] rounded-2xl shadow-lg p-4 flex flex-col items-center 
           transition transform hover:scale-105 hover:shadow-2xl duration-300 border border-[#d4af37]"
  >
    <img
      :src="book.coverUrl"
      :alt="book.title"
      class="w-40 h-56 object-cover rounded-lg mb-3 shadow-md"
    />
    <h2 class="text-lg font-semibold text-[#d4af37] text-center mb-1">
      {{ book.title }}
    </h2>
    <p class="text-sm text-[#bfa76f] mb-2 text-center">{{ book.year }}</p>
    <p class="text-sm text-gray-300 mb-3 text-center line-clamp-3 italic">
      {{ book.description }}
    </p>
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
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>