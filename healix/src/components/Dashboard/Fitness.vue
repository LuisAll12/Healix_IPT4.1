<script setup>
import ActivityChart from '../ActivityChart.vue';
import HampterLoader from '../HamsterLoader.vue';
import { ref, onMounted } from 'vue';
import { fetchLastFourActivities } from '../../services/GetLast4FA.js';

// Reaktive Variablen
const Last4Activitys = ref([]);
const isLoading = ref(true); // Zustand für das Laden

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
        isLoading.value = false; // Laden abgeschlossen
    }
};

// Datum formatieren
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('de-DE', { year: 'numeric', month: 'long', day: 'numeric' });
};

// Beim Mounten Daten laden
onMounted(() => {
    loadActivities();
});
</script>

<template>
    <div class="FitnessContainer">
        <!-- Loader anzeigen, solange Daten geladen werden -->
        <div class="loading" v-if="isLoading">
            <HampterLoader />
        </div>

        <!-- Dashboard anzeigen, wenn Daten geladen sind -->
        <div v-else>
            <div class="UpperDashboard">
                <div class="Chart">
                    <ActivityChart />
                </div>
                <div class="SideCards">
                    <div class="LastActivitys">
                        <div class="LastActivitys_Upper">
                            <div class="LastActivitys_Icon">
                                <img src="../../assets/images/icons/Sprint-Icon.png" alt="Goal Icon">
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
                                        <div>Duration: {{ activity.duration }} minutes</div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="LowerDashboard"></div>
        </div>
    </div>
</template>

<style scoped>
    @import '../../assets/components/DashboardComps/Fitness.css';
</style>
