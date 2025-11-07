<script setup>
import { RouterView } from 'vue-router'
import Navbar from './components/Ui/Navbar.vue';
import Footer from './components/Ui/Footer.vue';
import Toast from './components/Ui/Toast.vue';
</script>

<template>
  <div id="app">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<style scoped>
</style>
