<script setup>
import { ref } from 'vue';
import { registerMeal } from '../../services/RegisterMealAirtable.js';

// Variables
const MealName = ref('');
const Calories = ref('');
const Proteins = ref('');
const Fat = ref('');
const Sugar = ref('');
const ServingSize = ref('');
const Loader = ref(false); // Loader state

function Reset() {
    MealName.value = '';
    Calories.value = '';
    Proteins.value = '';
    Fat.value = '';
    Sugar.value = '';
    ServingSize.value = '';
}

function getSessionKeyFromCookies() {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
    }, {});
    return cookies['sessionKey'] || null; // Return null if not found
}

async function MealFormSubmit(event) {
    event.preventDefault(); // Prevent form reload

    if (!MealName.value || !Calories.value || !Proteins.value || !Fat.value || !Sugar.value || !ServingSize.value) {
        alert('Please fill in all the fields');
        return;
    }

    await SendToAirtable();
    Reset();
}

async function SendToAirtable() {
    const sessionKey = getSessionKeyFromCookies(); 

    if (!sessionKey) {
        alert("Session key not found. Please log in again.");
        return;
    }

    const formData = {
        Name: MealName.value,
        calories: Calories.value,
        Protein: Proteins.value,
        Fat: Fat.value,
        Sugar: Sugar.value,
        ServingSize: ServingSize.value || null, 
    };


    console.log('Submitting to Airtable:', formData);

    try {
        Loader.value = true;

        await registerMeal(formData, sessionKey);

        Loader.value = false;
        alert('Meal successfully submitted!');
    } catch (error) {
        console.error('Error submitting meal:', error);
        alert('There was an error submitting your meal. Please try again.');
    } finally {
        Loader.value = false; 
    }
}
</script>

<template>
    <div class="container">
        <div class="Left">
            <div class="NFA-Upper">
                <div class="Infomation">
                    <h1>Have you eaten something? Enter it precisely, and we'll calculate it for you!</h1>
                    <p>Fill in the fields to get the most accurate results</p>
                    <div class="Details">
                        <p>More Information</p>
                        <button class="Details-Button">Details</button>
                    </div>
                </div>
            </div>
            <div class="NFA-Lower">
                <img src="../../assets/images/pictures/Humaaans - Character.png" alt="">
            </div>
        </div>
        <div class="InputForm">
            <h1 class="title">Answer the form</h1>
            <form @submit="MealFormSubmit">
                <div class="FormField">
                    <label for="MealName">Meal Name</label>
                    <input class="InputField" id="MealName" v-model="MealName" placeholder="Shrimp Pasta" type="text" required />
                </div>
                <div class="FormField">
                    <label for="Calories">Calories</label>
                    <input class="InputField" id="Calories" v-model="Calories" placeholder="345" type="number" required />
                </div>
                <div class="FormField">
                    <label for="Proteins">Proteins</label>
                    <input class="InputField" id="Proteins" v-model="Proteins" placeholder="46 grams" type="number" required />
                </div>
                <div class="FormField">
                    <label for="Fat">Fat</label>
                    <input class="InputField" id="Fat" v-model="Fat" placeholder="6 grams" type="number" required />
                </div>
                <div class="FormField">
                    <label for="Sugar">Sugar</label>
                    <input class="InputField" id="Sugar" v-model="Sugar" placeholder="25 grams" type="number" required />
                </div>
                <div class="FormField">
                    <label for="ServingSize">Serving Size</label>
                    <input class="InputField" id="ServingSize" v-model="ServingSize" placeholder="200 grams" type="text" required />
                </div>
                <div class="SubmitButtons">
                    <button class="Submit-Button" type="submit">Submit</button>
                    <button class="Submit-Button" type="button" @click="Reset">Reset</button>
                </div>
            </form>
            <div v-if="Loader" class="Loader">Submitting...</div>
        </div>
    </div>
</template>

<style scoped>
    @import '../../assets/components/DashboardComps/NFA.css';
    .Loader {
        color: #555;
        font-size: 16px;
        margin-top: 10px;
    }
</style>
