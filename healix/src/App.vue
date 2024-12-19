<script setup>
  import NavBar from './components/NavBar.vue'
  import Footer from './components/Footer.vue'

  import { ref, onMounted } from 'vue';
// Create a reactive variable to track the session key status
const isSessionKeyAvailable = ref(false);
const NavbarShow = ref(true)
// Check for session key in sessionStorage
onMounted(() => {
  const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=");
    acc[key] = value;
    return acc;
  }, {});
  const sessionKey = cookies["sessionKey"];
  
  if (sessionKey) {
    NavbarShow.value = false;
    isSessionKeyAvailable.value = true;
  } else {
    NavbarShow.value = true;
  }
});

</script>

<template>
  <NavBar v-if="NavbarShow"/>
  <router-view />
  <Footer />
</template>

<style scoped>

</style>
