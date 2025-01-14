<script setup>
import { ref } from 'vue'; // Import Vue's ref for reactivity

// Reactive state for menu toggle
const isMenuActive = ref(false);

// Function to toggle menu
function toggleMenu() {
    isMenuActive.value = !isMenuActive.value;
}
</script>

<template>
<<<<<<< HEAD
        <!-- Navigation Bar -->
        <nav class="navbar">
            <div class="container">
                <img src="../assets/images/pictures/Logo.png" alt="Healix Logo" class="logo-image">
                <router-link to="/" class="logo">Healix</router-link>
                <button
                    class="menu-toggle"
                    aria-label="Toggle Navigation"
                    @click="toggleMenu"
                >
                    <span class="menu-bar"></span>
                    <span class="menu-bar"></span>
                    <span class="menu-bar"></span>
                </button>
                <ul class="nav-links" :class="{ active: isMenuActive }">
                    <ul>
                        <li><a href="#features">Services</a></li>
                    <li><a href="#how-it-works">Benefits</a></li>
                    <li><router-link to="/">Home</router-link></li>
                    </ul>
    
                </ul>
                <router-link to="/login" class="cta-button">Login</router-link>
            </div>
        </nav>
    
       <main class="home-content">
            
            <div class="rectangle">
                <div class="text">
                    <p class="headline">Your Smart Health Coach Always by Your Side</p>
                    <p class="subheadline">Track your progress, optimize your diet, and receive personalized tips for a healthier life.</p>
                    <img src="../assets/images/pictures/Humaans_Standing_Home.png" alt="Health Coach Illustration" class="hero-image">
                </div>
            </div>
        </main>
    </template>
    <style>
    @import '../assets/components/Home.css';
    </style>
    
=======
    <!-- Navigation Bar -->
    <nav class="navbar">
        <div class="container">
            <img src="../assets/images/pictures/Logo.png" alt="Healix Logo" class="logo-image">
            <router-link to="/" class="logo">Healix</router-link>
            <button
                class="menu-toggle"
                aria-label="Toggle Navigation"
                @click="toggleMenu"
            >
                <span class="menu-bar"></span>
                <span class="menu-bar"></span>
                <span class="menu-bar"></span>
            </button>
            <ul class="nav-links" :class="{ active: isMenuActive }">
                <ul>
                    <li><a href="#features">Services</a></li>
                <li><a href="#how-it-works">Benefits</a></li>
                <li><router-link to="/">Home</router-link></li>
                </ul>

            </ul>
            <router-link to="/login" class="cta-button">Login</router-link>
        </div>
    </nav>

   <main class="home-content">
        
        <div class="rectangle">
            <div class="text">
                <p class="headline">Your Smart Health Coach Always by Your Side</p>
                <p class="subheadline">Track your progress, optimize your diet, and receive personalized tips for a healthier life.</p>
                <img src="../assets/images/pictures/Humaans_Standing_Home.png" alt="Health Coach Illustration" class="hero-image">
            </div>
        </div>
    </main>
</template>

<style>
@import '../assets/components/Home.css';
</style>
>>>>>>> 78eccf525f222b36142516837861b5444af7ecf4
