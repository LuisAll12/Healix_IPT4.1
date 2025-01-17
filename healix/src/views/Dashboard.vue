<script setup>
import { ref, onMounted } from 'vue';
import { RouterLink, useRouter } from "vue-router";
import axios from "axios";



// Reactive variables

//API
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const tableName = import.meta.env.VITE_APP_TABLE_NAME;

//CheckCookie
const isSessionKeyAvailable = ref(false);
const NavbarShow = ref(true);
const router = useRouter();

onMounted(async () => {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
    }, {});

    const sessionKey = cookies["sessionKey"];
  
    if (sessionKey) {
        console.log("Session key found in cookies, validating with the database...");
        try {
        // Validate session key with Airtable

        const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
        const headers = {
            Authorization: `Bearer ${apiKey}`,
        };

        const encodedFormula = encodeURIComponent(`{SessionKey}="${sessionKey}"`);
        const response = await axios.get(`${url}?filterByFormula=${encodedFormula}`, { headers });
        
        // Extract records from response.data
        const records = response.data.records;

        if (records.length > 0) {
            console.log("Session key is valid.");
            isSessionKeyAvailable.value = true;
            NavbarShow.value = false;
        } else {
            console.log("Invalid session key, redirecting to login.");
            router.push("/login");
        }
        } catch (error) {
        console.error("Error validating session key:", error.response?.data || error.message);
        router.push("/login");
        }
    } else {
        console.log("No session key found in cookies, redirecting to login.");
        router.push("/login");
    }
});

const NavbarSelectedValue = ref(1);
//Navbartoggle
function NavbarToggle(ClickValue){
    NavbarSelectedValue.value = ClickValue;
}
const NavbarShowState = ref(true)
function NavbarIn(){
    NavbarShowState.value = !NavbarShowState.value;
    console.log(NavbarShowState.value)
}
</script>
<template>
    <div class="container" :class="{Navbarinactive: !NavbarShowState}">
      <div class="NavBarContainer">
        <div class="Navigation" v-if="NavbarShowState">
          <div class="Logo">
            <img src="../assets/images/pictures/Logo.png" alt="" />
            <h2>HEALIX</h2>
          </div>
          <br />
          <div class="General">
            <p class="title">General</p>
            <ul>
              <RouterLink to="/dashboard" class="li-item" :class="{SelectedNavItem: $route.path === '/dashboard'}">
                <img src="../assets/images/icons/Main-Icon.png" alt="" />
                <p class="NavbarItem">Main</p>
              </RouterLink>
              <RouterLink to="/dashboard/meals" class="li-item" :class="{SelectedNavItem: $route.path === '/dashboard/meals'}">
                <img src="../assets/images/icons/Diet-Icon.png" alt="" />
                <p class="NavbarItem">Meals</p>
              </RouterLink>
              <RouterLink to="/dashboard/fitness" class="li-item" :class="{SelectedNavItem: $route.path === '/dashboard/fitness'}">
                <img src="../assets/images/icons/Fitness-Icon.png" alt="" />
                <p class="NavbarItem">Fitness</p>
              </RouterLink>
              <RouterLink to="/dashboard/activity" class="li-item" :class="{SelectedNavItem: $route.path === '/dashboard/activity'}">
                <img src="../assets/images/icons/Activitys-Icon.png" alt="" />
                <p class="NavbarItem">Activities</p>
              </RouterLink>
            </ul>
          </div>
          <div class="Tools">
            <p class="title">Tools</p>
            <ul>
              <RouterLink to="/dashboard/new-meal" class="li-item-lower" :class="{SelectedNavItem: $route.path === '/dashboard/new-meal'}">
                <p class="NavbarItem">New Meal</p>
              </RouterLink>
              <RouterLink to="/dashboard/new-fitness" class="li-item-lower" :class="{SelectedNavItem: $route.path === '/dashboard/new-fitness'}">
                <p class="NavbarItem">New Fitness Activity</p>
              </RouterLink>
            </ul>
          </div>
        </div>
        <h1 class="toggle-button" @click="NavbarIn()" v-if="!NavbarShowState">></h1>
        <h1 class="toggle-button" @click="NavbarIn()" v-if="NavbarShowState"><</h1>
      </div>
  
      <div class="DashboardContent">
        <!-- Der dynamische Inhalt wird hier angezeigt -->
        <router-view />
      </div>
    </div>
</template>


<style scoped>
@import '../assets/components/Dashboard.css';
</style>
