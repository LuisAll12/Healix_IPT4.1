<script setup>
import { ref } from 'vue';

//Variables
const MealName = ref('');
const Calories = ref();
const Proteins = ref('');
const Fat = ref('');
const Sugar = ref('');

</script>
<template>
    <div class="container">
        <div class="Left">
            <div class="NFA-Upper">
                <div class="Infomation">
                    <h1>Have you eaten something? Enter it precisely, and we'll calculate it for you!</h1>
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
        <div class="InputForm">
            <h1 class="title">Answer the form</h1>
            <form action="">
                <div class="FormField">
                    <label for="MealName">Meal Name</label>
                    <input
                            class="InputField"
                            id="MealName"
                            v-model="MealName"
                            placeholder="Shrimp Pasta"
                            type="text"
                            required
                        />
                </div>
                <div class="FormField">
                    <label for="Duration">Calories</label>
                    <input
                            class="InputField"
                            id="Duration"
                            v-model="Calories"
                            placeholder="345"
                            type="number"
                            required
                        />
                </div>
                <div class="FormField">
                    <label for="proteins">Proteins</label>
                    <input
                            class="InputField"
                            id="proteins"
                            v-model="Proteins"
                            placeholder="46 grams"
                            type="number"
                            required
                        />
                </div>
                <div class="FormField">
                    <label for="fat">Fat</label>
                    <input
                            class="InputField"
                            id="fat"
                            v-model="Fat"
                            placeholder="6 grams"
                            type="number"
                            required
                        />
                </div>
                <div class="FormField">
                    <label for="sugar">Sugar</label>
                    <input
                            class="InputField"
                            id="sugar"
                            v-model="Sugar"
                            placeholder="25 grams"
                            type="number"
                        />
                </div>
            </form>
            <div class="SubmitButtons">
                <button class="Submit-Button" @click="NFAFormSubmit">Submit</button>
                <button class="Submit-Button" @click="Reset">Reset</button>
            </div>

        </div>
    </div>
</template>
<style scoped>
    @import '../../assets/components/DashboardComps/NFA.css';
</style>