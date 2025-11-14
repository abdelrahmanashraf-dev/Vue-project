<template>
  <div class="min-h-screen bg-[#f6f1e7] text-[#3a2f1f]">
    <!-- Hero Section -->
    <section
      class="relative bg-cover bg-center py-24 text-center text-[#e5d7b2]"
      style="background-image: url('https://hannahpethen.com/wp-content/uploads/2021/04/turinpapyrus1885_plantombrameseiv_kv2-2.jpg?w=1440');"
    >
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-4">
        <h1 class="text-5xl md:text-6xl font-extrabold mb-4 font-serif text-[#e5d7b2]">
          About House of Papyrus
        </h1>
        <p class="text-lg md:text-xl text-[#f1e9c9]">
          Where knowledge transcends time, written on the threads of history.
        </p>
      </div>
    </section>

    <!-- History Section -->
    <section class="max-w-5xl mx-auto py-16 px-6 text-center">
      <h2 class="text-4xl font-serif font-bold mb-6 text-[#3a2f1f]">Our History</h2>
      <p class="text-lg leading-relaxed text-[#4a3f2b]">
        The House of Papyrus traces its origins to the ancient libraries of Thebes and
        Alexandria — sacred spaces where wisdom was inked onto papyrus scrolls under
        golden lamplight. Reviving this legacy, our library brings together timeless
        knowledge and modern discovery. Every book here is a whisper from the past and
        a promise for the future, echoing the spirit of Egypt's ancient scribes who
        believed that "to write was to give life eternal."
      </p>
    </section>

    <!-- FAQ Section -->
    <section class="max-w-4xl mx-auto py-12 px-6">
      <h2 class="text-3xl font-serif font-bold mb-8 text-center text-[#3a2f1f]">
        Frequently Asked Questions
      </h2>

      <div class="space-y-4">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          :class="[
            'border border-[#cbb994] rounded-lg bg-[#faf5e1] shadow-sm transition-all duration-300 overflow-hidden',
            openIndex === index ? 'shadow-lg bg-[#fff6d9]' : 'hover:shadow-md',
          ]"
        >
          <div 
            @click="toggleFAQ(index)"
            class="cursor-pointer p-4 flex justify-between items-center"
          >
            <h3 class="font-semibold text-lg text-[#3a2f1f]">{{ faq.question }}</h3>
            <span
              class="text-[#a67c00] font-bold text-2xl transition-transform duration-300"
              :class="{ 'rotate-45': openIndex === index }"
            >
              +
            </span>
          </div>

          <transition
            name="slide-fade"
            @enter="enter"
            @leave="leave"
          >
            <div
              v-show="openIndex === index"
              class="px-4 pb-4"
            >
              <p class="text-[#4a3f2b] leading-relaxed">
                {{ faq.answer }}
              </p>
            </div>
          </transition>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const openIndex = ref(null);

const toggleFAQ = (index) => {
  openIndex.value = openIndex.value === index ? null : index;
};

// Animation hooks for smooth height transition
const enter = (el) => {
  el.style.height = '0';
  el.offsetHeight; // Force reflow
  el.style.height = el.scrollHeight + 'px';
};

const leave = (el) => {
  el.style.height = el.scrollHeight + 'px';
  el.offsetHeight; // Force reflow
  el.style.height = '0';
};

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
/* Slide and fade animation */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>