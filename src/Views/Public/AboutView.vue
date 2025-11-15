<template>
  <!-- 
    *** التعديل الأول ***
    ضفنا "data-theme" عشان نفعّل الثيم
    غيرنا "bg-[#f6f1e7]" لـ "bg-base-200" (خلفية الصفحة)
    غيرنا "text-[#3a2f1f]" لـ "text-base-content" (لون التيكست الأساسي)
  -->
  <div class="min-h-screen bg-base-200 text-base-content" data-theme="papyrus">
    <!-- Hero Section -->
    <section
      class="relative bg-cover bg-center py-24 text-center"
      style="background-image: url('https://hannahpethen.com/wp-content/uploads/2021/04/turinpapyrus1885_plantombrameseiv_kv2-2.jpg?w=1440');"
    >
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-4">
        <!-- 
          *** التعديل الثاني ***
          غيرنا الألوان اليدوية لـ "text-primary"
        -->
        <h1 class="text-5xl md:text-6xl font-extrabold mb-4 font-serif text-primary">
          About House of Papyrus
        </h1>
        <p class="text-lg md:text-xl text-primary/80">
          Where knowledge transcends time, written on the threads of history.
        </p>
      </div>
    </section>

    <!-- History Section -->
    <section class="max-w-5xl mx-auto py-16 px-6 text-center">
      <h2 class="text-4xl font-serif font-bold mb-6 text-base-content">Our History</h2>
      <!-- 
        *** التعديل الثالث ***
        غيرنا لون التيكست لـ "text-base-content/80" (أفتح سيكا)
      -->
      <p class="text-lg leading-relaxed text-base-content/80">
        The House of Papyrus traces its origins to the ancient libraries of Thebes and
        Alexandria — sacred spaces where wisdom was inked onto papyrus scrolls under
        golden lamplight. Reviving this legacy, our library brings together timeless
        knowledge and modern discovery. Every book here is a whisper from the past and
        a promise for the future, echoing the spirit of Egypt's ancient scribes who
        believed that "to write was to give life eternal."
      </p>
    </section>

    <!-- 
      *** التعديل الرابع (الأهم) ***
      استبدلنا الـ FAQ اليدوي بالكامل بـ daisyUI "collapse"
      ده ألغى الحاجة للجافاسكربت والـ <style>
    -->
    <section class="max-w-4xl mx-auto py-12 px-6">
      <h2 class="text-3xl font-serif font-bold mb-8 text-center text-base-content">
        Frequently Asked Questions
      </h2>

      <!-- 
        استخدمنا "join" عشان نلزقهم في بعض
        واستخدمنا "radio" عشان واحد بس اللي يفتح في المرة
      -->
      <div class="join join-vertical w-full">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="collapse collapse-arrow join-item border border-base-300 bg-base-100"
        >
          <input 
            type="radio" 
            name="faq-accordion" 
            :id="'faq-' + index" 
            :checked="index === 0" 
          />
          <label 
            :for="'faq-' + index" 
            class="collapse-title text-lg font-semibold text-base-content cursor-pointer"
          >
            {{ faq.question }}
          </label>
          <div class="collapse-content">
            <p class="text-base-content/80">
              {{ faq.answer }}
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

// كل كود الجافاسكربت بتاع الأنيميشن والـ toggle اتشال
// مبقاش فاضل غير الداتا بس

const faqs = [
  {
    question: "What is the House of Papyrus?",
    answer:
      "It's an online library inspired by ancient Egyptian knowledge, bringing together timeless literature and modern storytelling.",
  },
  {
    question: "How can I borrow or buy a book?",
    answer:
      "Simply explore our catalog, select a title, and choose the borrow or purchase option according to your preference.",
  },
  {
    question: "Do you offer ancient manuscripts or rare editions?",
    answer:
      "Yes, we feature digital replicas of ancient manuscripts and rare literary collections in our heritage section.",
  },
  {
    question: "Is membership required to access books?",
    answer:
      "Basic access is free, but premium members enjoy unlimited downloads and exclusive archival material.",
  },
  {
    question: "Can I donate books to the library?",
    answer:
      "Absolutely. We welcome digital or physical book donations that align with our vision of cultural preservation.",
  },
  {
    question: "What inspired the name 'House of Papyrus'?",
    answer:
      "The name pays homage to the papyrus scrolls of ancient Egypt — the earliest form of written preservation known to humankind.",
  },
  {
    question: "Do you have an educational program?",
    answer:
      "Yes, we run cultural workshops and reading circles focusing on ancient literature and historical storytelling.",
  },
  {
    question: "Are the books available in multiple languages?",
    answer:
      "Our collection spans English, Arabic, and select translations of ancient texts to ensure accessibility for all readers.",
  },
  {
    question: "Can I visit a physical branch of the library?",
    answer:
      "Currently, we are a digital-first institution, but a physical reading hall is planned as part of our expansion vision.",
  },
  {
    question: "How can I contact the House of Papyrus team?",
    answer:
      "You can reach us via the Contact section or email us directly at info@houseofpapyrus.com.",
  },
];
</script>

<style scoped>
/* كل كود الـ CSS اتشال
  لأن كومبوننت "collapse" بيعمل كل الشغل ده لوحده
*/
</style>