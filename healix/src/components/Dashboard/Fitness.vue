<script setup>
import ActivityChart from '../ActivityChart.vue';
import HampterLoader from '../HamsterLoader.vue';
import { ref, onMounted } from 'vue';
import { fetchLastFourActivities } from '../../services/GetLast4FA.js';
import {fetchMostTrainedMuscle, fetchAverageCardioDuration, fetchBurntCaloriesLastCardio, fetchBMR } from '../../services/FitnessFetch.js';

// Reaktive Variablen
const Last4Activitys = ref([]);
const isLoading = ref(true); // Zustand für das Laden


const MostTrainedMuscle = ref();
const AvgCardioDurition = ref();
const BurntCaloriesLastCardio = ref();
const BMR = ref();
// Aktivitäten laden
const loadActivities = async () => {
    try {
        const fetchedActivities = await fetchLastFourActivities();
        if (fetchedActivities) {
            Last4Activitys.value = fetchedActivities.map(activity => ({
                ...activity,
                formattedDate: formatDate(activity.createDate),
            }));
        } else {
            console.error('No activities found or an error occurred.');
        }
    } catch (error) {
        console.error('Error loading activities:', error);
    } finally {
        isLoading.value = false;
    }
};

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
};
onMounted(async () => {
    MostTrainedMuscle.value = await fetchMostTrainedMuscle();
    AvgCardioDurition.value = await fetchAverageCardioDuration();
    BurntCaloriesLastCardio.value = await fetchBurntCaloriesLastCardio();
    BMR.value = await fetchBMR();
    loadActivities();
    });

</script>

<template>
    <div class="FitnessContainer">
        <div class="loading" v-if="isLoading">
            <HampterLoader />
        </div>
        <div v-else>
            <div class="UpperDashboard">
                <div class="Chart">
                    <ActivityChart />
                </div>
                <div class="SideCards">
                    <div class="LastActivitys">
                        <div class="LastActivitys_Upper">
                            <div class="LastActivitys_Icon">
                                <img src="../../assets/images/icons/Activitys-Icon.png" alt="Goal Icon">
                            </div>
                            <div class="LastActivitys_Title">
                                <h1>Last Fitness entries</h1> 
                            </div>
                        </div>
                        <div class="LastActivitys_Lower">
                            <div class="Info_Title">
                                <p>Recent activities</p>
                            </div>
                            <div class="Value">
                                <ul>
                                    <li v-for="(activity, index) in Last4Activitys" :key="activity.id">
                                        <strong>Activity {{ activity.formattedDate }}:</strong>
                                        <div>Category: {{ activity.category }}</div>
                                        <diwv>Duration: {{ activity.duration }} minutes</diwv>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="LowerDashboard">
                <div class="cards">
                    <div class="card">
                        <div class="tools">
                            <div class="circle">
                                <span class="red box"></span>
                            </div>
                            <div class="circle">
                                <span class="yellow box"></span>
                            </div>
                            <div class="circle">
                                <span class="green box"></span>
                            </div>
                        </div>
                        <div class="card__content">
                            <!-- Most trained Muscle -->
                                <h2>Your most exersized muscle is your:</h2>
                                <h1>{{MostTrainedMuscle.muscle}}</h1>
                        </div>
                    </div>
                    <div class="card">
                        <div class="tools">
                            <div class="circle"> 
                                <span class="red box"></span>
                            </div>
                            <div class="circle">
                                <span class="yellow box"></span>
                            </div>
                            <div class="circle">
                                <span class="green box"></span>
                            </div>
                        </div>
                        <div class="card__content">
                            <!-- average duration -->
                            <h2>Your avg. durition in cardio is<span><br>hh:mm</span></h2>
                            <h1>{{AvgCardioDurition}} h</h1>
                        </div>
                    </div>
                    <div class="card">
                        <div class="tools">
                            <div class="circle">
                                <span class="red box"></span>
                            </div>
                            <div class="circle">
                                <span class="yellow box"></span>
                            </div>
                            <div class="circle">
                                <span class="green box"></span>
                            </div>
                        </div>
                        <div class="card__content">
                            <!-- burnt calories with last cardio session -->
                                <h2>In your last run, you have burnt</h2>
                                <h1>{{ BurntCaloriesLastCardio }} kcal</h1>
                        </div>
                    </div>
                    <div class="card">
                        <div class="tools">
                            <div class="circle">
                                <span class="red box"></span>
                            </div>
                            <div class="circle">
                                <span class="yellow box"></span>
                            </div>
                            <div class="circle">
                                <span class="green box"></span>
                            </div>
                        </div>
                        <div class="card__content">
                            <!-- BMR -->
                            <h2>This is your calorie requirement</h2>
                            <h1>{{ BMR }} kcal</h1>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    @import '../../assets/components/DashboardComps/Fitness.css';
</style>
