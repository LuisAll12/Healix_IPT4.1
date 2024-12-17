<script setup>
const isMenuActive = false;
function toggleMenu() {
    this.isMenuActive = !this.isMenuActive;
}
</script>
<template>
        <nav class="navbar">
        <div class="container">
            <router-link to="/" class="logo">Healix</router-link>
            <button
                class="menu-toggle"
                aria-label="Navigation umschalten"
                @click="toggleMenu"
            >
                <span class="menu-bar"></span>
                <span class="menu-bar"></span>
                <span class="menu-bar"></span>
            </button>
            <ul class="nav-links" :class="{ active: isMenuActive }">
                <li><a href="#features">Services</a></li>
                <li>
                    <a href="#how-it-works">Benefits</a>
                </li>
                <li><router-link to="/">Home</router-link></li>
            </ul>
            <RouterLink to="/login" class=".cta-button">Login</RouterLink>
        </div>
    </nav>
</template>

<style src="../assets/components/Navbar.css"></style>