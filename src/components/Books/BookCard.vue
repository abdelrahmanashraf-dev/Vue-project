<template>
  <!-- 
    ده الكود بالثيم اللي عملناه (papyrus)
    bg-base-100 (الكريمي)
  -->
  <div class="bg-base-100 shadow-md w-full max-w-md mx-auto rounded-xl flex flex-col xl:flex-row overflow-hidden min-w-0">
    
    <!-- 
      استخدمنا xl: عشان الريسبونسيف
    -->
    <figure class="flex-shrink-0 w-full xl:w-48">
      <img
        :src="book.coverUrl"
        :alt="book.title"
        class="w-full h-64 xl:h-full object-cover"
      />
    </figure>

    <!-- 
      ضفنا min-w-0 عشان نحل مشكلة قص الكلام
    -->
    <div class="p-4 xl:p-6 flex flex-col justify-between min-w-0">
      <div>
        <!-- 
          text-primary (اللون الذهبي من الثيم)
        -->
        <h2 class="text-lg xl:text-xl font-semibold text-primary text-left mb-1">
          {{ book.title }}
        </h2>
        <!-- 
          text-secondary (اللون الثانوي من الثيم)
        -->
        <p class="text-sm text-secondary text-left mb-3">{{ book.year }}</p>

        <!-- 
          text-base-content (لون التيكست الأساسي)
          break-words (عشان الريسبونسيف)
        -->
        <p class="text-sm text-base-content/70 text-left mb-4 break-words">
          {{ book.description }}
        </p>
      </div>

      <div class="flex justify-center">
        <!-- 
          *** التعديل اللي طلبته اهو ***
          
          1. استبدلنا <button> بـ <router-link>
          2. ضيفنا ":to" عشان نربطه بـ id الكتاب
          3. استخدمنا كلاسات "btn btn-primary" من الثيم
        -->
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
// كود الجافاسكربت زي ما هو
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
/* No styles needed */
</style>