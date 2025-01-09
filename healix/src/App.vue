<script setup>
  import NavBar from './components/NavBar.vue'
  import Footer from './components/Footer.vue'
  import Login from './views/Dashboard.vue'
  import { ref } from 'vue';
  const NavbarShow = ref(false);

  function updateNavbarShow(value){
    NavbarShow.value = value;
  }

</script>

<template>
  <NavBar v-if="NavbarShow"/>
  <router-view />
  <Footer />
</template>

<style scoped>
  @import './assets/global.css';
</style>
