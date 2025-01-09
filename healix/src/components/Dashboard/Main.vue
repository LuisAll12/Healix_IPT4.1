<script setup>
import { ref, onMounted } from 'vue';
import { getLoggedInUserData } from '../../services/GetUserData.js';
import Airtable from 'airtable';

import HampterLoader from '../HamsterLoader.vue';

const userData = ref(null); // Use null for a single user's data


const age = ref();
const BMI = ref();
const BMIText = ref("");
const GoalAchieved = ref(false);
const GoalTitle = ref("Just do it!");
const GoalSubText = ref("Have you reached your goal today?")
const SportClassTitle = ref("Fitness rating")
const SportClassPrecentage = ref("0")



const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const Table = "UserData";
const base = new Airtable({ apiKey }).base(baseId);

async function getUserRank(userData) {
  try {
    // Hole alle Sportklassen der Benutzer aus Airtable
    const records = await base(Table).select({
      fields: ['SportClass']  // Das Feld, das wir abfragen wollen
    }).all();

    // Sportklasse des eingelogten Benutzers
    const userSportClass = userData.SportClass;

    // Extrahiere die Sportklassen aus den Airtable-Daten
    const sportClasses = records.map(record => record.fields.SportClass);

    // Definiere die Rangordnung der Sportklassen
    const sportClassRank = ['A', 'B', 'C', 'D']; // 'A' ist am besten, 'D' am schlechtesten

    // Konvertiere jede Sportklasse in einen numerischen Rang (A=4, B=3, C=2, D=1)
    const sportClassNumeric = sportClasses.map(className => sportClassRank.indexOf(className) + 1);
    const userSportClassNumeric = sportClassRank.indexOf(userSportClass) + 1;

    // Sortiere die Sportklassenränge in absteigender Reihenfolge (bessere Klassen sind vorne)
    sportClassNumeric.sort((a, b) => b - a);

    // Berechne die Position des Benutzers
    const userPosition = sportClassNumeric.indexOf(userSportClassNumeric) + 1; // 1-based Position
    console.log(userPosition);
    // Berechne den Prozentsatz basierend auf der Position
    const totalUsers = sportClassNumeric.length;
    const percentage = ((totalUsers - userPosition) / (totalUsers - 1)) * 100;

    // Weisen Sie den Benutzer eine Note zu, basierend auf dem Prozentsatz
    let grade;
    if (percentage >= 90) {
      grade = 'A';  // Top 10% oder besser
    } else if (percentage >= 75) {
      grade = 'B';  // 75% bis 89%
    } else if (percentage >= 50) {
      grade = 'C';  // 50% bis 74%
    } else {
      grade = 'D';  // Unter 50%
    }

    // Rückgabe der Werte: Note, Prozentsatz, und Rang
    return {
      grade,
      percentage: percentage.toFixed(2),  // Prozentsatz auf 2 Dezimalstellen gerundet
      rank: userPosition,  // 1-basierter Rang
    };

  } catch (error) {
    console.error('Fehler beim Abrufen von Daten aus Airtable:', error);
  }
}



getUserRank(userData).then(result => {
  console.log(`User grade: ${result.grade}`);        // Grade: A, B, C, or D
  console.log(`User percentage: ${result.percentage}`);   
  SportClassPrecentage.value = result.percentage;   // Prozentsatz, z.B. 95.34%
  console.log(`User rank: ${result.rank}`);          // Rang (1-basierter Rang, z.B. 1st)
});


function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);

    let age = today.getFullYear() - birth.getFullYear();

    // Adjust if the birthday hasn't occurred yet this year
    const monthDifference = today.getMonth() - birth.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}

function calculateBMI(weight, height){
    const calcBMI = ref(null);
    calcBMI.value = (weight / (height * height)).toFixed(2);

    if (calcBMI.value < 18.5) {
        BMIText.value = "You're underweight";
    } else if (calcBMI.value >= 18.5 && calcBMI.value <= 25) {
        BMIText.value = "Perfect!";
    } else {
        BMIText.value = "You're overweight";
    }

    return calcBMI.value;
}

function setCookie(name, value) {
  const date = new Date();
  date.setDate(date.getDate() + 1);  

  // Create the cookie string and set it
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  GoalAchieved.value = checkCookie('cookie_achieved'); 
}

function checkCookie(name) {
  const cookies = document.cookie.split(';');
  for (let cookie of cookies) {
    let [cookieName, cookieValue] = cookie.trim().split('=');
    if (cookieName === name) {
      if (cookieValue === 'true') {  // Compare with 'true' as string
        // Set the reactive variables (you can set these outside checkCookie as well)
        GoalAchieved.value = true;
        GoalTitle.value = "Nice one";
        GoalSubText.value = "Tomorrow just as good again!";
        return true;
      } else {
        GoalAchieved.value = false;
        return false;
      }
    }
  }
  GoalAchieved.value = false;
  return false;
}


onMounted(async () => {
    userData.value = await getLoggedInUserData();
    if (userData.value) {
        console.log("Logged-in user data:", userData.value);
        age.value = calculateAge(userData.value.BirthDate)
        BMI.value = calculateBMI(userData.value.Weight, userData.value.Height)
        GoalAchieved.value = checkCookie('cookie_achieved'); 
    } else {
        console.warn("No user data found or user is not logged in.");
    }
});
</script>

<template>
    <div class="container">
        <div class="UpperPart" v-if="userData">
            <div class="Greet">
                <h1>Welcome {{ userData.FirstName }} {{ userData.LastName }}</h1>
            </div>
            <div class="Cards">
                <div class="card age">
                    <div class="card-title">
                        <h4>Age</h4>
                    </div>
                    <div class="card-value">
                        {{ age }}
                    </div>
                </div>
                <div class="card weight">
                    <div class="card-title">
                        <h4>Weight, kg</h4>
                    </div>
                    <div class="card-value">
                        {{ userData.Weight }}
                    </div>
                </div>
                <div class="card height">
                    <div class="card-title">
                        <h4>Height, cm</h4>
                    </div>
                    <div class="card-value">
                        {{ userData.Height }}
                    </div>
                </div>
            </div>
            <div class="Metrics">
                <div class="results-summary-container">
                    <div class="confetti" v-if="BMIText == 'Perfect!' ">
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                    </div>
                    <div class="results-summary-container__result">
                        <div class="heading-tertiary">Your BMI</div>
                        <div class="result-box">
                            <div class="heading-primary">{{ BMI }}</div>
                        </div>
                        <div class="result-text-box">
                            <div class="heading-secondary">{{ BMIText }}</div>
                            <p class="paragraph">
                                The body mass index (BMI) is used to estimate the percentage of body fat 
                            </p>
                        </div>
                    </div>
                </div>
                <div class="results-summary-container">
                    <div class="confetti" v-if="GoalAchieved">
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                    </div>
                    <div class="results-summary-container__result">
                        <div class="heading-tertiary">Your Goal</div>
                        <div class="result-box">
                            <div class="heading-primaryGoal">{{ userData.Goal }}</div>
                        </div>
                        <div class="result-text-box">
                            <div class="heading-secondary">{{ GoalTitle }}</div>
                            <p class="paragraph">
                                {{ GoalSubText }}
                            </p>
                        </div>
                        <div class="summary__cta" >
                            <button class="btn btn__continue" v-if="!GoalAchieved" @click="setCookie('cookie_achieved', 'true');">Goal achieved 
                            </button>
                        </div>
                    </div>
                </div>
                <div class="results-summary-container">
                    <div class="confetti" v-if="userData.SportClass == 'B' || userData.SportClass == 'A'">
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                        <div class="confetti-piece"></div>
                    </div>
                    <div class="results-summary-container__result">
                        <div class="heading-tertiary">Your SportClass</div>
                        <div class="result-box">
                            <div class="heading-primary">{{ userData.SportClass }}</div>
                        </div>
                        <div class="result-text-box">
                            <div class="heading-secondary">{{ SportClassTitle }}</div>
                            <p class="paragraph">
                                You scored {{ SportClassPrecentage }}% higher than of the people who are competeing against you.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="LowerPart" v-if="userData">
            <!-- Add additional user-specific details here -->
        </div>
        <div v-else class="loading">
            <HampterLoader />
        </div>
    </div>
</template>

<style scoped>
    @import '../../assets/components/DashboardComps/Main.css';
    @import '../../assets/components/DashboardComps/ResultCard.css';
</style>
