<script setup>
import { ref } from 'vue';
import { registerInAirtable } from '../../services/airtable.js';
// Variables
const Category = ref('');
const Intensity = ref();
const Duration = ref('0:00');
const MuscleGroup = ref('');
const Steps = ref('');
const Loader = ref(false);  // Loader state

function Reset() {
    Category.value = '';
    Intensity.value = '';
    Duration.value = '0:00';
    MuscleGroup.value = '';
    Steps.value = '';
}

function getSessionKeyFromCookies() {
    const cookies = document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, value] = cookie.split("=");
        acc[key] = value;
        return acc;
    }, {});
    
    return cookies['sessionKey'];  // Return the session key value
}

// Form submission handler
function NFAFormSubmit() {
    if (!Category.value || !Intensity.value || !Duration.value || !MuscleGroup.value) {
        alert('Please fill in all the fields');
        return;
    } else {
        SendToAirtable();
        Reset();
    }
}

async function SendToAirtable() {
    const sessionKey = getSessionKeyFromCookies(); // Get session key
    console.log('Session key:', sessionKey);
    const formData = {
        Category: Category.value,
        Intensity: Intensity.value,
        Duration: Duration.value,
        MuscleGroup: MuscleGroup.value,
        Steps: Steps.value,
    };

    console.log('Submitting to Airtable:', formData);

    // Show the loader while data is being written
    Loader.value = true;

    // Register form data in Airtable
    await registerInAirtable(formData, sessionKey);

    // Hide the loader after data is written
    Loader.value = false;
}
</script>

<template>
    <div class="container">
        <div class="Left">
            <div class="NFA-Upper">
                <div class="Infomation">
                    <h1>The more specific you are, the more accurate your results will be</h1>
                    <p>Fill in the fields to get the most accurate results</p>
                    <br>
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
        <div class="InputForm" v-if="!Loader">
            <h1 class="title">Answer the form</h1>
            <form action="">
                <div class="FormField">
                    <label for="Category">Category</label>
                    <select name="category" id="category" class="InputField" v-model="Category">
                        <option value="" disabled selected>Select a Category</option>
                        <option value="weightlifting">Weightlifting</option>
                        <option value="cardio">Cardio</option>
                        <option value="bodyweight">Bodyweight</option>
                        <option value="balance">Balance</option>
                    </select>
                </div>
                <div class="FormField">
                    <label for="Duration">Duration</label>
                    <input
                            class="InputField"
                            id="duration"
                            v-model="Duration"
                            placeholder="h:mm"
                            type="text"
                            required
                        />
                </div>
                <div class="FormField">
                    <label for="Category">Musclegroup</label>
                    <select name="category" id="musclegroup" class="InputField" v-model="MuscleGroup">
                        <option value="" disabled selected>Select a Muscle</option>
                        <option value="weightlifting">Arm</option>
                        <option value="cardio">Legs</option>
                        <option value="bodyweight">Chest</option>
                        <option value="balance">Back</option>
                        <option value="balance">Abs</option>
                    </select>
                </div>
                <div class="FormField" v-if="Category == 'cardio'">
                    <label for="Duration">Steps</label>
                    <input
                            class="InputField"
                            id="steps"
                            v-model="Steps"
                            placeholder="2554"
                            type="number"
                            required
                        />
                </div>
                <div class="FormField">
                    <label for="Intensity">Intensity</label>
                    <select name="category" id="Intensity" class="InputField" v-model="Intensity">
                        <option value="" disabled selected>Choose the Intensity</option>
                        <option value="1">Very High</option>
                        <option value="2">High</option>
                        <option value="3">Medium</option>
                        <option value="4">Low</option>
                    </select>
                </div>
            </form>
            <div class="SubmitButtons">
                <button class="Submit-Button" @click="NFAFormSubmit">Submit</button>
                <button class="Submit-Button" @click="Reset">Reset</button>
            </div>
        </div>
        
        <!-- Loader section -->
        <div class="loader" v-if="Loader">
            
        </div>
    </div>
</template>

<style scoped>
    @import '../../assets/components/DashboardComps/NFA.css';
</style>