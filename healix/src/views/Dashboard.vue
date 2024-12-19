<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import axios from "axios";


//API
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const tableName = import.meta.env.VITE_APP_TABLE_NAME;
// Reactive variables
const isSessionKeyAvailable = ref(false);
const NavbarShow = ref(true);

// Initialize router
const router = useRouter();

// Check for session key in cookies and validate with the database
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

      // Query Airtable for a matching session key
      const response = await axios.get(`${url}?filterByFormula={SessionKey}="${sessionKey}"`, { headers });
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

</script>

<template>
    <div class="container">
        <div class="Navigation">
            <div class="Logo">
                <img src="../assets/images/pictures/Logo.png" alt="">
                <h2>Healix</h2>
            </div>
            <div class="General">
                <p class="title">General</p>
            </div>
            <div class="Tools">
                
            </div>
        </div>
        <div class="DashboardContent">
            <div class="MainDashboard">

            </div>
        </div>
    </div>
</template>

<style scoped>
@import '../assets/components/Dashboard.css';
</style>