<template>
    <div class="Activity-container">
        <div class="UpperDashboard" v-if="setProgressFinished == true">
            <div class="Graph">
                <ActivityHeatmap />
            </div>
            <div class="SideFacts">
                <div class="Goal_Widget">
                    <div class="Goal_Icon">
                        <img src="../../assets/images/icons/Goal-Icon.png" alt="Goal Icon">
                    </div>
                    <div class="Goal_Title">
                        <h1>Goal: {{ userData.Goal }}</h1> 
                    </div>
                </div>
                <div class="TotalSteps_Widget">
                    <div class="TotalSteps_Widget_Upper">
                        <div class="TotalSteps_Icon">
                            <img src="../../assets/images/icons/Sprint-Icon.png" alt="Goal Icon">
                        </div>
                        <div class="TotalSteps_Title">
                            <h1>Monthly Steps</h1> 
                        </div>
                    </div>
                    <div class="TotalSteps_Widget_Lower">
                        <br><br><br>
                        <div class="Info_Title">
                            <p>You took</p>
                        </div>
                        <div class="Value">
                            <h1>{{ MonthlySteps?.totalSteps || 0 }}</h1>
                        </div>
                        <div class="Info_Title">
                            <p>steps this month</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="LowerDashboard" v-if="setProgressFinished == true">
            <div class="Activity_Widgets">
                <div class="Cardio_Widget">
                        <div class="icon-container">
                        <div class="icon">
                            <img src="../../assets/images/icons/Sprint-Icon.png" alt="Bicycle Icon" />
                        </div>
                        </div>
                        <div class="content">
                        <h3 class="title">Running Drill</h3>
                        <p class="subtitle">{{ WeekGoalCardio }} Steps / week</p>
                        <div class="progress-bar">
                            <div class="progress" :style="{ width: CardioProgress + '%' }"></div>
                        </div>
                        <div class="details">
                            <span class="distance">{{ WeeklySteps?.totalSteps || 0 }} / {{ WeekGoalCardio }} Steps</span>
                            <span class="time-left">{{ DaysLeft }} days left</span>
                        </div>
                    </div>
                </div>
                    <div class="Weightlifting_Widget">
                        <div class="icon-container">
                            <div class="icon">
                                <img src="../../assets/images/icons/Fitness-Icon.png" alt="Bicycle Icon" />
                            </div>
                        </div>
                        <div class="content">
                            <h3 class="title">Weightlifting Drill</h3>
                            <p class="subtitle">{{ WeekGoalWeightlifting }} Sessions / week</p>
                            <div class="progress-bar">
                                <div class="progress" :style="{ width: WeightliftingProgress + '%' }"></div>
                        </div>
                        <div class="details">
                            <span class="distance">{{ WLSessions?.entryCount || 0 }} / {{ WeekGoalWeightlifting }} Sessions</span>
                            <span class="time-left">{{ DaysLeft }} days left</span>
                        </div>
                    </div>
                </div>
                    <div class="BodyWeight_Widget">
                        <div class="icon-container">
                        <div class="icon">
                            <img class="Plank-Icon" src="../../assets/images/icons/Plank-Icon.png" alt="Bicycle Icon" />
                        </div>
                        </div>
                        <div class="content">
                        <h3 class="title">Bodyweight Drill</h3>
                        <p class="subtitle">{{ WeekGoalBodyWeight }} Sessions / week</p>
                        <div class="progress-bar" v-if="WeekGoalBodyWeightAchieved == false">
                            <div class="progress" :style="{ width: BodyWeightProgress + '%' }"></div>
                        </div>
                        <div class="details">
                            <span class="distance">{{ BWSessions?.BWSessionsCount || 0 }} / {{ WeekGoalBodyWeight }} Sessions</span>
                            <span class="time-left">{{ DaysLeft }} days left</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="loading">
            <HampterLoader />
        </div>
    </div>
</template>

<script setup>
    import { getLoggedInUserData } from '../../services/GetUserData.js';
    import  { fetchUserStepsInMonth, fetchUserStepsInWeek }  from '../../services/StepsThisMonth.js';
    import { fetchWeightliftingEntriesCount } from '../../services/GetWLSessions.js'
    import { fetchBodyWeightEntriesCount } from '../../services/GetBWSessions.js'
    import { ref, onMounted, computed } from 'vue';
    import ActivityHeatmap from '../ActivityHeatmap.vue';

    import HampterLoader from '../HamsterLoader.vue';
    const DaysLeft = ref(null)
    const userData = ref(null);
    const MonthlySteps = ref();
    const WeeklySteps = ref();
    const WLSessions = ref();
    const BWSessions = ref();

    const CardioProgress = ref(0);
    const WeightliftingProgress = ref(20);
    const BodyWeightProgress = ref(23);

    const WeekGoalCardio = ref(null);
    const WeekGoalWeightlifting = ref(null);
    const WeekGoalBodyWeight = ref(null);

    const GoalCardioAchieved = ref(false);
    const GoalWeightliftingAchieved = ref(false);
    const WeekGoalBodyWeightAchieved = ref(false);

    const today = new Date().getDay();
    const setProgressFinished = ref(false)
    DaysLeft.value = computed(() => {
        return 7 - today;
    });



    function getGoalsOutOfSportClass(){
        const UsersSportClass = userData.value.SportClass;
        console.log(UsersSportClass);
        if(UsersSportClass == 'A'){
            WeekGoalCardio.value =  120000;
            WeekGoalWeightlifting.value = 6;
            WeekGoalBodyWeight.value = 5;
        }
        else if(UsersSportClass == 'B'){
            WeekGoalCardio.value =  70000;
            WeekGoalWeightlifting.value = 4;
            WeekGoalBodyWeight.value = 3;
        }
        else if(UsersSportClass == 'C'){
            WeekGoalCardio.value =  50000;
            WeekGoalWeightlifting.value = 2;
            WeekGoalBodyWeight.value = 3;
        }
        else{
            WeekGoalCardio.value =  30000;
            WeekGoalWeightlifting.value = 1;
            WeekGoalBodyWeight.value = 2;
        }
    }
    
    function setProgress(){
        CardioProgress.value = WeeklySteps.value.totalSteps / WeekGoalCardio.value * 100
        WeightliftingProgress.value = WLSessions.value.entryCount / WeekGoalWeightlifting.value * 100
        BodyWeightProgress.value = BWSessions.value.BWSessionsCount / WeekGoalBodyWeight.value * 100

        if(WeeklySteps.value.totalSteps >= WeekGoalCardio.value){
            GoalCardioAchieved.value = true;
        }
        if(WLSessions.value.entryCounts >=  WeekGoalWeightlifting.value){
            GoalWeightliftingAchieved.value = true;
        }
        if(MonthlySteps.value.totalSteps >= WeekGoalCardio.value){
            GoalCardioAchieved.value = true;
        }
        return true;
    }

    onMounted(async () => {
        userData.value = await getLoggedInUserData();
        getGoalsOutOfSportClass();

        // Fetch monthly steps and weightlifting sessions
        MonthlySteps.value = await fetchUserStepsInMonth();
        WeeklySteps.value = await fetchUserStepsInWeek();
        console.log('Fetched Steps:', MonthlySteps.value, ' ', WeeklySteps.value); // Debugging log

        WLSessions.value = await fetchWeightliftingEntriesCount();
        BWSessions.value = await fetchBodyWeightEntriesCount();
        console.log('Fetched Weightlifting Sessions:', WLSessions.value);

        setProgressFinished.value = setProgress();
        console.log(setProgressFinished.value);
        if (userData.value && setProgressFinished.value == true) {
            console.log("Logged-in user data:", userData.value);
        } else {fetchUserStepsInWeek
            console.warn("No user data found or user is not logged in.");
        }
    });
</script>

<style scoped>
    @import '../../assets/components/DashboardComps/Activitys.css';
</style>
