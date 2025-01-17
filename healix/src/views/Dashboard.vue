<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import axios from "axios";
import Activity from '../components/Dashboard/Activity.vue';
import Fitness from '../components/Dashboard/Fitness.vue';
import Main from '../components/Dashboard/Main.vue';
import Meals from '../components/Dashboard/Meals.vue';
import NewMeal from '../components/Dashboard/NewMeal.vue';
import NFA from '../components/Dashboard/NFA.vue';


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
const NavbarShowState = ref(false)
function NavbarIn(){
    NavbarShowState.value = !NavbarShowState.value;
    console.log(NavbarShowState.value)
}
</script>

<template>
    <div class="container" :class="{Navbarinactive: !NavbarShowState }">
        <div class="NavBarContainer">
            <div class="Navigation" v-if="NavbarShowState" >
                <div class="Logo">
                    <img src="../assets/images/pictures/Logo.png" alt="">
                    <h2>HEALIX</h2>
                </div>
                <br>
                <div class="General">
                    <p class="title">General</p>
                    <ul>
                        <li @click="NavbarToggle(1)" class="li-item" :class="{SelectedNavItem: NavbarSelectedValue == 1}"><img src="../assets/images/icons/Main-Icon.png" alt=""><p class="NavbarItem">Main</p></li>
                        <li @click="NavbarToggle(2)" class="li-item" :class="{SelectedNavItem: NavbarSelectedValue == 2}"><img src="../assets/images/icons/Diet-Icon.png" alt=""><p class="NavbarItem">Meals</p></li>
                        <li @click="NavbarToggle(3)" class="li-item" :class="{SelectedNavItem: NavbarSelectedValue == 3}"><img src="../assets/images/icons/Fitness-Icon.png" alt=""><p class="NavbarItem">Fitness</p></li>
                        <li @click="NavbarToggle(4)" class="li-item" :class="{SelectedNavItem: NavbarSelectedValue == 4}"><img src="../assets/images/icons/Activitys-Icon.png" alt=""><p class="NavbarItem">Activitys</p></li>
                    </ul>
                </div>
                <div class="Tools">
                    <p class="title">Tools</p>
                    <ul>
                        <li @click="NavbarToggle(5)" class="li-item-lower" :class="{SelectedNavItem: NavbarSelectedValue == 5}"><p class="NavbarItem">New Meal</p></li>
                        <li @click="NavbarToggle(6)" class="li-item-lower" :class="{SelectedNavItem: NavbarSelectedValue == 6}"><p class="NavbarItem">New Fitness activity</p></li>
                    </ul>
                </div>
            </div>
            <h1 class="toggle-button" @click="NavbarIn()" v-if="!NavbarShowState">></h1>
            <h1 class="toggle-button" @click="NavbarIn()" v-if="NavbarShowState"><</h1>
        </div>
        <div class="DashboardContent">
            <div class="MainDashboard" v-if="NavbarSelectedValue == 1">
                <Main />
            </div>
            <div class="MealsDashboard" v-if="NavbarSelectedValue == 2">
                <Meals />
            </div>
            <div class="FitnessDashboard" v-if="NavbarSelectedValue == 3">
                <Fitness />
            </div>
            <div class="ActivityDashboard" v-if="NavbarSelectedValue == 4">
                <Activity />
            </div>
            <div class="NewMealDashboard" v-if="NavbarSelectedValue == 5">
                <NewMeal />
            </div>
            <div class="NFADashboard" v-if="NavbarSelectedValue == 6">
                <NFA />
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '../assets/components/Dashboard.css';
</style>