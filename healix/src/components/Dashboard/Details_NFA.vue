<script setup>
import { useRouter } from 'vue-router';
const router = useRouter();
</script>
<template>
    <div class="Details-Container">
        <div class="Card">
            <button @click="router.push('/dashboard/new-fitness')">
                <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                <span>Back</span>
            </button>
            <h1 class="title">
                This form allows you to log your fitness activities by providing specific details to ensure accurate tracking.
            </h1>
            <h1 class="title">Here's what you can do:</h1>
            <ul>
                <li><strong>Category:</strong> Select the type of activity (e.g., Weightlifting, Cardio, Bodyweight, Balance) to categorize your workout.</li>
                <li><strong>Duration:</strong> Enter the length of your workout session in hours and minutes (e.g., 1:30 for 1 hour and 30 minutes)</li>
                <li><strong>Muscle Group:</strong> Choose the muscle group you focused on during the workout (e.g., Arm, Legs, Chest, Back, Abs).</li>
                <li><strong>Steps:</strong> For cardio exercises, enter the number of steps you took during the session.</li>
                <li><strong>Intensity:</strong> Choose the intensity of your workout (Very High, High, Medium, or Low).</li>
            </ul>
            <h3>Once you've filled in the fields, you can submit the form to track your workout. You also have the option to reset the form and start over if needed. The more detailed your input, the more accurate your results will be!</h3>
        </div>
    </div>
</template>
<style scoped>
    .Details-Container{
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
    }
    .Card{
        width: 50%;
        height: auto;
        background-image: linear-gradient(to bottom, var(--primary), var(--bg));
        box-shadow: 10px 20px 20px rgba(120, 87, 255, 0.3);
        padding: 25px;
        border-radius: 16px;
    }

li{
    color: #b1b1b1;
}
/* From Uiverse.io by Jedi-hongbin */ 
button {
 display: flex;
 height: 3em;
 width: 100px;
 align-items: center;
 justify-content: center;
 background-color: #eeeeee4b;
 border-radius: 3px;
 letter-spacing: 1px;
 transition: all 0.2s linear;
 cursor: pointer;
 border: none;
 background: #fff;
}

button > svg {
 margin-right: 5px;
 margin-left: 5px;
 font-size: 20px;
 transition: all 0.4s ease-in;
}

button:hover > svg {
 font-size: 1.2em;
 transform: translateX(-5px);
}

button:hover {
    box-shadow: 10px 20px 20px rgba(35, 24, 80, 0.507);
 transform: translateY(-2px);
}
@media only screen and (max-width: 1500px) {
    .Card{
        width: 70%;
    }
    h1{
        font-size: 3vw;
    }
    h3{
        font-size: 2.5vw;
    }
    li{
        font-size: 2.5vw;
    }
}
@media only screen and (max-width: 700px) {
    h1{
        font-size: 3vw;
    }
    h3{
        font-size: 2.5vw;
    }
    li{
        font-size: 2.5vw;
    }
}
</style>