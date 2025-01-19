<template>
    <div class="EditContainer">
        <div class="Loader" v-if="isloading">
            <HampterLoader />
        </div>
        <div class="Card" v-else>
            <button class="backbutton" @click="router.push('/dashboard/Meals')">
                <svg height="16" width="16" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 1024 1024"><path d="M874.690416 495.52477c0 11.2973-9.168824 20.466124-20.466124 20.466124l-604.773963 0 188.083679 188.083679c7.992021 7.992021 7.992021 20.947078 0 28.939099-4.001127 3.990894-9.240455 5.996574-14.46955 5.996574-5.239328 0-10.478655-1.995447-14.479783-5.996574l-223.00912-223.00912c-3.837398-3.837398-5.996574-9.046027-5.996574-14.46955 0-5.433756 2.159176-10.632151 5.996574-14.46955l223.019353-223.029586c7.992021-7.992021 20.957311-7.992021 28.949332 0 7.992021 8.002254 7.992021 20.957311 0 28.949332l-188.073446 188.073446 604.753497 0C865.521592 475.058646 874.690416 484.217237 874.690416 495.52477z"></path></svg>
                <span>Back</span>
            </button>
            <ul>
                <li v-for="meal in meals" :key="meal.id">
                <div v-if="meal.isEditing">
                    <div class="Inputs">
                        <input class="input" required type="text" v-model="meal.name" placeholder="Meal Name" />
                        <input class="input" required type="number" v-model.number="meal.calories" placeholder="Calories" />
                        <input class="input" required type="number" v-model.number="meal.protein" placeholder="Protein" />
                    </div>
                    <div class="Buttons">
                        <button class="SaveBtn" type="submit" @click="updateMeal(meal)">
                            Save
                        </button>
                        <button class="CancelBtn" @click="meal.isEditing = false">Cancel</button>
                    </div>
                </div>
                <div v-else>
                    <h2>{{ meal.name }}</h2>
                    <p>Calories: {{ meal.calories }}</p>
                    <p>Protein: {{ meal.protein }}g</p>
                    <div class="Buttons">
                        <button class="EditBtn" @click="meal.isEditing = true">
                        Edit
                        <svg class="svg" viewBox="0 0 512 512">
                            <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"></path>
                        </svg>
                    </button>
                    <button class="DelBtn" @click="deleteMeal(meal.id)">
                        <div class="sign">
                            <svg
                            viewBox="0 0 16 16"
                            class="bi bi-trash3-fill"
                            fill="currentColor"
                            height="18"
                            width="18"
                            xmlns="http://www.w3.org/2000/svg"
                            >
                            <path
                                d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"
                            ></path>
                            </svg>
                        </div>
                        <div class="text">Delete</div>
                    </button>
                    </div>
                    
                </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import Airtable from 'airtable';
    import { getSessionKeyFromCookies } from '../../services/GetSessionKey';
    import { useRouter } from 'vue-router';
    import HampterLoader from '../../components/HamsterLoader.vue';
    const router = useRouter();
    const apiKey = import.meta.env.VITE_APP_API_KEY;
    const baseId = import.meta.env.VITE_APP_BASE_ID;
    const base = new Airtable({ apiKey }).base(baseId);

    const meals = ref([]);
    
    const isloading = ref(true)
    const fetchUserMeals = async () => {
        try {
        const sessionKey = getSessionKeyFromCookies();
        if (!sessionKey) {
            console.log('Session key not found!');
            return;
        }
    
        const usersTable = 'UserData';
        const usersQuery = await base(usersTable)
            .select({
            filterByFormula: `{SessionKey} = "${sessionKey}"`,
            maxRecords: 1,
            })
            .firstPage();
    
        if (usersQuery.length === 0) {
            console.log('No user found for the given session key!');
            return;
        }
    
        const userRecord = usersQuery[0];
        const userNumber = userRecord.fields.UserId;
    
        const filterFormula = `{UserData} = "${userNumber}"`;
    
        const mealQuery = await base('Meal')
            .select({
            filterByFormula: filterFormula,
            sort: [{ field: 'CreateDate', direction: 'desc' }],
            })
            .all();
    
        meals.value = mealQuery.map(record => ({
            id: record.id,
            name: record.fields.Name || 'Unknown',
            calories: record.fields.calories || 0,
            protein: record.fields.Protein || 0,
            isEditing: false,
        }));
        } catch (error) {
        console.error('Error fetching meals:', error);
        }
    };
    
    const updateMeal = async (meal) => {
        try {
        await base('Meal').update(meal.id, {
            Name: meal.name,
            calories: meal.calories,
            Protein: meal.protein,
        });
        meal.isEditing = false;
        console.log('Meal updated successfully');
        } catch (error) {
        console.error('Error updating meal:', error);
        }
    };
    
    const deleteMeal = async (mealId) => {
        try {
        await base('Meal').destroy(mealId);
        meals.value = meals.value.filter(meal => meal.id !== mealId);
        console.log('Meal deleted successfully');
        } catch (error) {
        console.error('Error deleting meal:', error);
        }
    };
    onMounted(async () => {
        await fetchUserMeals();
        isloading.value = false;
    });
</script>
<style scoped>
    .EditContainer{
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
        margin-top: 10px;
    }
    h1, h2, h4, p{
    margin: 5px;
    }
    ul{
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-wrap: wrap;  /* Ermöglicht das Umbrechen von Elementen */
    }
    li {
        display: flex;
        flex-direction: column;
        align-items: flex-start; /* Verwendet flex-start, um sicherzustellen, dass die Elemente links ausgerichtet sind */
        width: 40%;  /* 100% der Breite */
        min-height: 75%;
        padding: 24px;
        border-radius: 16px;
        color: var(--text);
        background: var(--secondary);
        animation: gradient 9s linear infinite;
    }
    li {
        flex: 1 1 calc(50% - 10px); /* 50% Breite minus Abstand (optional) */
        margin: 5px; /* Abstand zwischen den Elementen */
    }
    .Buttons{
        display: flex;
        gap: 10px;
    }
    .backbutton {
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

    .backbutton > svg {
    margin-right: 5px;
    margin-left: 5px;
    font-size: 20px;
    transition: all 0.4s ease-in;
    }

    .backbutton:hover > svg {
    font-size: 1.2em;
    transform: translateX(-5px);
    }

    .backbutton:hover {
        box-shadow: 10px 20px 20px rgba(35, 24, 80, 0.507);
    transform: translateY(-2px);
    }
    .EditBtn, .SaveBtn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100px;
  height: 40px;
  border: none;
  padding: 0px 20px;
  background-color: rgb(168, 38, 255);
  color: white;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 5px 5px 0px rgb(140, 32, 212);
  transition-duration: .3s;
}
.CancelBtn{
    position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100px;
  height: 40px;
  border: none;
  padding: 0px 20px;
  background-color: rgb(125, 30, 189);
  color: white;
  font-weight: 500;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 5px 5px 0px rgb(138, 32, 209);
  transition-duration: .3s;
}
.svg {
  width: 13px;
  position: absolute;
  right: 0;
  margin-right: 20px;
  fill: white;
  transition-duration: .3s;
}

.EditBtn:hover {
  color: transparent;
}

.EditBtn:hover svg {
  right: 43%;
  margin: 0;
  padding: 0;
  border: none;
  transition-duration: .3s;
}

.EditBtn:active {
  transform: translate(3px , 3px);
  transition-duration: .3s;
  box-shadow: 2px 2px 0px rgb(140, 32, 212);
}
/* From Uiverse.io by Tsiangana */ 
.DelBtn {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 45px;
  gap: 10px;
  height: 45px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition-duration: 0.3s;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
  background-image: linear-gradient(to bottom, var(--primary), var(--bg));
}

/* plus sign */
.sign {
  width: 100%;
  transition-duration: 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sign svg {
  width: 17px;
}

.sign svg path {
  fill: white;
}
/* text */
.text {
  position: absolute;
  right: 0%;
  width: 0%;
  opacity: 0;
  color: white;
  font-size: 1.2em;
  font-weight: 600;
  transition-duration: 0.3s;
}
/* hover effect on button width */
.DelBtn:hover {
  width: 125px;
  border-radius: 40px;
  transition-duration: 0.3s;
}

.DelBtn:hover .sign {
  width: 30%;
  transition-duration: 0.3s;
  padding-left: 20px;
}
/* hover effect button's text */
.DelBtn:hover .text {
  opacity: 1;
  width: 70%;
  transition-duration: 0.3s;
  padding-right: 10px;
}
/* button click effect*/
.DelBtn:active {
  transform: translate(2px, 2px);
}
.input {
 border: none;
 padding: 1rem;
 border-radius: 1rem;
 background: #e8e8e8;
 transition: 0.3s;
}

.input:focus {
 outline-color: #e8e8e8;
 background: #e8e8e8;
 box-shadow: inset 20px 20px 60px #c5c5c5,
		inset -20px -20px 60px #ffffff;
 transition: 0.3s;
}
</style>