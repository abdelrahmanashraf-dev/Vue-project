<template>
  <div>
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
    <Toast
      :show="toastState.show"
      :message="toastState.message"
      :type="toastState.type"
      :duration="toastState.duration"
      @close="hideToast"
    />
  </div>
</template>

<script setup>
import Navbar from '@/components/Ui/Navbar.vue'
import Footer from '@/components/Ui/Footer.vue'
import Toast from '@/components/Ui/Toast.vue'
import { useToast } from '@/composables/useToast'


const { toastState, hideToast } = useToast()
</script>
