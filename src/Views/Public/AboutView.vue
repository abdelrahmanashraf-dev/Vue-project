<template>
  <div class="min-h-screen bg-base-200 text-base-content" data-theme="papyrus">
    <!-- Hero Section -->
    <section
      class="relative bg-cover bg-center py-24 text-center"
      style="background-image: url('https://hannahpethen.com/wp-content/uploads/2021/04/turinpapyrus1885_plantombrameseiv_kv2-2.jpg?w=1440');"
    >
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
      <div class="relative z-10 max-w-4xl mx-auto px-4">
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
      <p class="text-lg leading-relaxed text-base-content/80">
        The House of Papyrus traces its origins to the ancient libraries of Thebes and
        Alexandria — sacred spaces where wisdom was inked onto papyrus scrolls under
        golden lamplight. Reviving this legacy, our library brings together timeless
        knowledge and modern discovery. Every book here is a whisper from the past and
        a promise for the future, echoing the spirit of Egypt's ancient scribes who
        believed that "to write was to give life eternal."
      </p>
    </section>

    <!-- Mission & Vision Section -->
    <section class="bg-base-100 py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-4xl font-serif font-bold mb-12 text-center text-base-content">
          Our Mission & Vision
        </h2>
        
        <div class="grid md:grid-cols-2 gap-8">
          <!-- Mission Card -->
          <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <i class="fas fa-bullseye text-3xl text-primary-content"></i>
                </div>
                <h3 class="card-title text-2xl font-serif text-base-content">Our Mission</h3>
              </div>
              <p class="text-base-content/80 leading-relaxed">
                To preserve and share the world's literary treasures, making timeless wisdom 
                accessible to all. We bridge ancient knowledge with modern technology, ensuring 
                that every voice from the past continues to inspire future generations.
              </p>
            </div>
          </div>

          <!-- Vision Card -->
          <div class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div class="card-body">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <i class="fas fa-eye text-3xl text-primary-content"></i>
                </div>
                <h3 class="card-title text-2xl font-serif text-base-content">Our Vision</h3>
              </div>
              <p class="text-base-content/80 leading-relaxed">
                To become the world's premier digital sanctuary for literature and culture, 
                where every reader finds connection to humanity's shared heritage. We envision 
                a future where knowledge flows freely across time and borders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Core Values Section -->
    <section class="py-16 px-6">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-serif font-bold mb-12 text-center text-base-content">
          Our Core Values
        </h2>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div v-for="value in coreValues" :key="value.title" 
               class="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-primary">
            <div class="card-body text-center">
              <div class="text-5xl mb-4">
                <i :class="[value.icon, value.color]"></i>
              </div>
              <h3 class="card-title justify-center text-xl font-serif mb-2 text-base-content">
                {{ value.title }}
              </h3>
              <p class="text-base-content/70">{{ value.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics Section -->
    <section class="bg-gradient-to-br from-primary/10 to-secondary/10 py-16">
      <div class="max-w-6xl mx-auto px-6">
        <h2 class="text-4xl font-serif font-bold mb-12 text-center text-base-content">
          Our Impact in Numbers
        </h2>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div v-for="stat in statistics" :key="stat.label" 
               class="text-center p-6 bg-base-100 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300">
            <div class="text-4xl md:text-5xl font-bold text-primary mb-2">
              {{ stat.value }}
            </div>
            <div class="text-sm md:text-base text-base-content/70 font-semibold">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="py-16 px-6 bg-base-100">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-4xl font-serif font-bold mb-4 text-center text-base-content">
          Meet Our Team
        </h2>
        <p class="text-center text-base-content/70 mb-12 max-w-2xl mx-auto">
          Passionate bibliophiles and historians dedicated to preserving literary heritage
        </p>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="member in teamMembers" :key="member.name" 
               class="card bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
            <figure class="pt-6 px-6">
              <div class="avatar">
                <div class="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-4">
                  <img :src="member.avatar" :alt="member.name" />
                </div>
              </div>
            </figure>
            <div class="card-body text-center">
              <h3 class="card-title justify-center text-xl font-serif text-base-content">
                {{ member.name }}
              </h3>
              <p class="text-primary font-semibold text-sm">{{ member.role }}</p>
              <p class="text-base-content/70 text-sm mt-2">{{ member.bio }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Timeline Section -->
    <section class="py-16 px-6">
      <div class="max-w-4xl mx-auto">
        <h2 class="text-4xl font-serif font-bold mb-12 text-center text-base-content">
          Our Journey
        </h2>
        
        <ul class="timeline timeline-vertical timeline-snap-icon">
          <li v-for="(milestone, index) in timeline" :key="index">
            <div class="timeline-middle">
              <div class="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <i :class="milestone.icon" class="text-xl text-primary-content"></i>
              </div>
            </div>
            <div :class="index % 2 === 0 ? 'timeline-start md:text-end' : 'timeline-end'">
              <time class="font-mono italic text-primary font-bold">{{ milestone.year }}</time>
              <div class="text-lg font-bold text-base-content mt-1">{{ milestone.title }}</div>
              <p class="text-base-content/70 mt-2">{{ milestone.description }}</p>
            </div>
            <hr v-if="index < timeline.length - 1" class="bg-primary" />
          </li>
        </ul>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="max-w-4xl mx-auto py-16 px-6 bg-base-100">
      <h2 class="text-3xl font-serif font-bold mb-8 text-center text-base-content">
        Frequently Asked Questions
      </h2>

      <div class="join join-vertical w-full">
        <div
          v-for="(faq, index) in faqs"
          :key="index"
          class="collapse collapse-arrow join-item border border-base-300 bg-base-200"
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

    <!-- Call to Action Section -->
    <section class="py-16 bg-gradient-to-r from-primary/20 to-secondary/20">
      <div class="max-w-4xl mx-auto text-center px-6">
        <h2 class="text-4xl font-serif font-bold mb-6 text-base-content">
          Join Our Community
        </h2>
        <p class="text-lg text-base-content/80 mb-8 max-w-2xl mx-auto">
          Become part of a global community of readers, scholars, and history enthusiasts. 
          Start your journey through time today.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <router-link to="/books" class="btn btn-primary btn-lg gap-2">
            <i class="fas fa-book"></i>
            Explore Library
          </router-link>
          <button class="btn btn-outline btn-lg gap-2">
            <i class="fas fa-envelope"></i>
            Contact Us
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from "vue";

const coreValues = [
  {
    icon: "fas fa-scroll",
    color: "text-primary",
    title: "Preservation",
    description: "Safeguarding humanity's literary legacy for future generations through digital innovation."
  },
  {
    icon: "fas fa-globe",
    color: "text-secondary",
    title: "Accessibility",
    description: "Making knowledge available to everyone, everywhere, breaking down barriers to learning."
  },
  {
    icon: "fas fa-users",
    color: "text-accent",
    title: "Community",
    description: "Building connections between readers, scholars, and cultures across the globe."
  },
  {
    icon: "fas fa-compass",
    color: "text-primary",
    title: "Discovery",
    description: "Enabling exploration of both familiar classics and hidden literary treasures."
  },
  {
    icon: "fas fa-balance-scale",
    color: "text-secondary",
    title: "Integrity",
    description: "Maintaining authenticity and accuracy in every text we preserve and share."
  },
  {
    icon: "fas fa-lightbulb",
    color: "text-accent",
    title: "Innovation",
    description: "Blending ancient wisdom with cutting-edge technology for modern readers."
  }
];

const statistics = [
  { value: "50K+", label: "Books" },
  { value: "200+", label: "Authors" },
  { value: "100K+", label: "Readers" },
  { value: "30+", label: "Countries" }
];

const teamMembers = [
  {
    name: "Dr. Amira Hassan",
    role: "Chief Librarian",
    avatar: "https://ui-avatars.com/api/?name=Amira+Hassan&background=d4af37&color=fff&size=256",
    bio: "Egyptologist with 20 years of experience in ancient manuscript preservation."
  },
  {
    name: "Omar Khalil",
    role: "Digital Curator",
    avatar: "https://ui-avatars.com/api/?name=Omar+Khalil&background=bfa76f&color=fff&size=256",
    bio: "Technology expert specializing in digital archiving and cultural heritage."
  },
  {
    name: "Layla Mostafa",
    role: "Community Manager",
    avatar: "https://ui-avatars.com/api/?name=Layla+Mostafa&background=a1802d&color=fff&size=256",
    bio: "Passionate about connecting readers with transformative literary experiences."
  }
];

const timeline = [
  {
    year: "2018",
    icon: "fas fa-seedling",
    color: "text-primary",
    title: "Foundation",
    description: "House of Papyrus was established with a mission to digitize ancient Egyptian texts."
  },
  {
    year: "2019",
    icon: "fas fa-book",
    color: "text-secondary",
    title: "First Collection",
    description: "Launched our inaugural collection of 1,000 digitized manuscripts."
  },
  {
    year: "2021",
    icon: "fas fa-globe-americas",
    color: "text-accent",
    title: "Global Expansion",
    description: "Expanded our reach to serve readers in over 30 countries worldwide."
  },
  {
    year: "2023",
    icon: "fas fa-trophy",
    color: "text-primary",
    title: "Recognition",
    description: "Received the UNESCO Digital Heritage Award for excellence in preservation."
  },
  {
    year: "2024",
    icon: "fas fa-rocket",
    color: "text-secondary",
    title: "New Chapter",
    description: "Introducing interactive features and community-driven collections."
  }
];

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