<script setup>
import { onMounted, ref, computed } from 'vue';
import { getLoggedInUserData } from '../../services/GetUserData.js';
import { fetchLastFiveMeals } from '../../services/GetLastMeals.js';
import { fetchRandomMeals } from '../../services/GetMealSug.js';
import { fetchCaloriesBurntToday } from '../../services/GetCaloriesBurnt.js';
import { fetchCaloriesConsumedToday, fetchProteinConsumedToday, fetchTodaysMealCount } from '../../services/GetCaloriesTd.js';
import { useRouter } from 'vue-router';

const router = useRouter();
const Last4Meals = ref([]);
const RndMeals = ref([]);

const TodaysCal = ref(0);
const TodaysInputs = ref(0);

const TodaysCalBurnt = ref(0);

const ProteinGoal = ref(0);
const Bodyweight = ref(0);
const TodaysProtein = ref(0);

const ProgressBarProteinGoal = computed(() => {
  return ProteinGoal.value > 0 ? (TodaysProtein.value / ProteinGoal.value) * 100 : 0;
});


const consumptionBarHeight = computed(() => {
  const total = TodaysCalBurnt.value + TodaysCal.value;
  if (total === 0) return 0; // Prevent division by zero
  return (TodaysCalBurnt.value / total) * 100;
});

const intakeBarBarHeight = computed(() => {
  const total = TodaysCalBurnt.value + TodaysCal.value;
  if (total === 0) return 0; // Prevent division by zero
  return (TodaysCal.value / total) * 100;
});

onMounted(async () => {
    const userData = await getLoggedInUserData();
    Bodyweight.value = userData.Weight;
    ProteinGoal.value = Bodyweight.value * 1.3;
    Last4Meals.value = await fetchLastFiveMeals();
    RndMeals.value = await fetchRandomMeals();
    TodaysCalBurnt.value = await fetchCaloriesBurntToday();
    TodaysCal.value = await fetchCaloriesConsumedToday();
    TodaysProtein.value = await fetchProteinConsumedToday();
    TodaysInputs.value = await fetchTodaysMealCount();
});
</script>

<template>
    <div class="Meals-Container">
        <div class="UpperMealsDashboard">
            <div class="UpperCard">
                <h2 class="title">Todays Calories</h2>
                <h3 class="value">{{ TodaysCal }}</h3>
                <h2 class="title">Todays input count</h2>
                <h3 class="value">{{ TodaysInputs }}</h3>
            </div>
            <div class="UpperCard">
                <h2>Daily Protein Goal</h2>
                <h3>{{ ProteinGoal.toFixed(0)}}g</h3>
                <h3>You have {{ TodaysProtein }}g</h3>
                <div class="progress-bar">
                    <div class="progress" :style="{ width: ProgressBarProteinGoal + '%' }"></div>
                </div>
            </div>
            <div class="UpperCard">
                <h2>Kcal Balance</h2>
                <div class="bars">
                    <div class="BalanceBar">
                        <div class=" consumptionBar" :style="{ height: consumptionBarHeight + '%'}">{{ TodaysCalBurnt }}Kcal</div>
                        <h4>Kcal burnt</h4>
                    </div>
                    <div class="BalanceBar">
                        <div class="intakeBar" :style="{ height: intakeBarBarHeight + '%'}">{{ TodaysCal }}Kcal</div>
                        <h4>Kcal eaten</h4>
                    </div>
                </div>
            </div>
        </div>
        <div class="LowerMealsDashboard">
            <div class="LastMeals LowerCard">
                <h1>Last 4 Meals</h1>
                <div class="Value">
                    <ul>
                        <li v-for="(meal, index) in Last4Meals" :key="meal.id">
                            <strong> {{meal.name}}  {{ new Date(meal.createDate).toLocaleDateString() }}</strong>
                            <div>Calories: {{ meal.calories }}</div>
                            <div>Protein: {{ meal.protein }}g</div>
                            <div>Fat: {{ meal.fat || 'Not specified' }}g</div>
                            <br>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="MealSuggestion LowerCard">
                <h1>We Suggest</h1>
                <ul>
                <!-- Die for-Schleife geht durch jedes Mahlzeit und gibt die relevanten Daten aus -->
                <li v-for="meal in RndMeals" :key="meal.id" class="MealSug">
                    <h2>{{ meal.mealName }}</h2>
                    <p>Diet Type: {{ meal.dietType }}</p>
                    <p>Protein: {{ meal.protein }} per 100 kcal</p>
                </li>
                </ul>
            </div>
            <div class="EditCard">
                <h1>Edit Meals</h1>
                <div class="RouteButton">
                    <button class="cta" @click="router.push('/dashboard/meals/edit')">
                        <span>Edit</span>
                            <svg width="15px" height="10px" viewBox="0 0 13 10">
                                <path d="M1,5 L11,5"></path>
                                <polyline points="8 1 12 5 8 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    @import '../../assets/components/DashboardComps/Meals.css';
</style>