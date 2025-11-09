<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Hero -->
    <section
      class="relative bg-cover bg-center bg-no-repeat text-white py-24 mb-10 rounded-3xl shadow-xl overflow-hidden"
      style="background-image: url('https://mediaaws.almasryalyoum.com/news/large/2014/08/01/238318_0.jpg');">
      <div class="absolute inset-0 bg-black bg-opacity-70"></div>

      <div class="relative z-10 max-w-5xl mx-auto text-center px-4">
        <h1 class="text-5xl md:text-6xl font-serif font-bold mb-6 text-amber-300 drop-shadow-lg tracking-wide">
          House of Papyrus
        </h1>

        <p class="text-lg md:text-xl text-amber-300 mb-8 leading-relaxed font-light">
          Journey into a world of ancient wisdom
          where scrolls wrote stories, and imagination was immortalised in papyrus.
        </p>

        <a href="/about" class="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition-transform hover:scale-105">
          Enter the Library
        </a>
      </div>
      <div
        class="absolute top-0 left-0 w-52 h-52 bg-amber-400 opacity-10 blur-3xl rounded-full"
      ></div>
      <div
        class="absolute bottom-0 right-0 w-72 h-72 bg-amber-600 opacity-10 blur-3xl rounded-full"
      ></div>
    </section>

    <!-- Books Section -->
    <div class="max-w-7xl mx-auto px-4 pb-16">
      <h2 class="text-3xl font-bold text-center mb-10 text-gray-800">
      Our Book Collection
      </h2>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
      >
        <BookCard v-for="book in books" :key="book.id" :book="book" />
      </div>
    </div>
  </div>
</template>

<script>
import BookCard from "@/components/Books/BookCard.vue";

export default {
  name: "HomeView",
  components: { BookCard },
  data() {
    return {
      books: [
        {
          id: 1,
          title: "Mistborn",
          year: 2006,
          tags: ["Fantasy"],
          coverUrl:
            "https://m.media-amazon.com/images/I/91+LJ8A4tkL._AC_UF894,1000_QL80_.jpg",
          description:
            "An epic fantasy novel set in a world ruled by the immortal Lord Ruler.",
        },
        {
          id: 2,
          title: "The Way of Kings",
          year: 2010,
          tags: ["Fantasy"],
          coverUrl:
            "https://m.media-amazon.com/images/I/91zK1cQxUjL._AC_UF894,1000_QL80_.jpg",
          description:
            "The first book in The Stormlight Archive series, full of political intrigue and war.",
        },
        {
          id: 3,
          title: "Words of Radiance",
          year: 2014,
          tags: ["Fantasy"],
          coverUrl:
            "https://m.media-amazon.com/images/I/81WfZtNf+DL._AC_UF1000,1000_QL80_.jpg",
          description:
            "Continuation of The Stormlight Archive story with deeper character arcs.",
        },
        {
          id: 4,
          title: "Murder on the Orient Express",
          year: 1934,
          tags: ["Mystery"],
          coverUrl:
            "https://m.media-amazon.com/images/I/71yEoJQ2Z0L._AC_UF894,1000_QL80_.jpg",
          description:
            "Detective Hercule Poirot investigates a murder on a train.",
        },
        {
          id: 5,
          title: "And Then There Were None",
          year: 1939,
          tags: ["Mystery"],
          coverUrl:
            "https://m.media-amazon.com/images/I/81F1m3ffg8L._AC_UF894,1000_QL80_.jpg",
          description:
            "Ten strangers are invited to a remote island where a murder mystery unfolds.",
        },
        {
          id: 6,
          title: "A Game of Thrones",
          year: 1996,
          tags: ["Fantasy"],
          coverUrl:
            "https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_UF894,1000_QL80_.jpg",
          description:
            "Noble families vie for control of the Iron Throne in the Seven Kingdoms.",
        },
        {
          id: 7,
          title: "A Clash of Kings",
          year: 1998,
          tags: ["Fantasy"],
          coverUrl:
            "https://m.media-amazon.com/images/I/91PYZcNKXRL._AC_UF894,1000_QL80_.jpg",
          description:
            "The sequel to A Game of Thrones, filled with battles and betrayal.",
        },
        {
          id: 8,
          title: "Harry Potter and the Sorcerer’s Stone",
          year: 1997,
          tags: ["Fantasy"],
          coverUrl:
            "https://m.media-amazon.com/images/I/81YOuOGFCJL._AC_UF894,1000_QL80_.jpg",
          description:
            "The story of a young wizard discovering his magical heritage.",
        },
        {
          id: 9,
          title: "Harry Potter and the Chamber of Secrets",
          year: 1998,
          tags: ["Fantasy"],
          coverUrl:
            "https://m.media-amazon.com/images/I/91OINeHnJGL._AC_UF894,1000_QL80_.jpg",
          description:
            "Harry’s second year at Hogwarts brings new mysteries.",
        },
        {
          id: 10,
          title: "The Shining",
          year: 1977,
          tags: ["Horror"],
          coverUrl:
            "https://m.media-amazon.com/images/I/81KkM92+8pL._AC_UF894,1000_QL80_.jpg",
          description:
            "A psychological horror about isolation and madness.",
        },
        {
          id: 11,
          title: "It",
          year: 1986,
          tags: ["Horror"],
          coverUrl:
            "https://m.media-amazon.com/images/I/81Aq1Uuo0tL._AC_UF894,1000_QL80_.jpg",
          description:
            "A group of friends face an ancient evil that resurfaces every 27 years.",
        },
        {
          id: 12,
          title: "The Fellowship of the Ring",
          year: 1954,
          tags: ["Fantasy"],
          coverUrl:
            "https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_UF894,1000_QL80_.jpg",
          description:
            "The first part of The Lord of the Rings trilogy.",
        },
      ],
    };
  },
};
</script>