<template>
  <div>
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup>
import Navbar from '@/components/Ui/Navbar.vue'
import Footer from '@/components/Ui/Footer.vue'
import Toast from '@/components/Ui/Toast.vue'
</script>
