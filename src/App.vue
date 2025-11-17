<template>
  <div  >
    <router-view />
    
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
import { useToast } from './composables/useToast';
import Toast from './components/Ui/Toast.vue';
const { toastState, hideToast } = useToast()

</script>
