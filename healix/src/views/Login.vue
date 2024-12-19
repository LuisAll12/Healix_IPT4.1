<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const ShowRegistersucces = ref(false);

//API
const apiKey = import.meta.env.VITE_APP_API_KEY;
const baseId = import.meta.env.VITE_APP_BASE_ID;
const tableName = import.meta.env.VITE_APP_TABLE_NAME;

const emit = defineEmits(['update-navbar-show']);
//Login
const router = useRouter();
const LoginEmail = ref("");
const LoginPassword = ref("");
const ErrorMessage = ref("");

const generateSessionKey = () => {
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
    let result = "";
    for (let i = 0; i < 30; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const setSessionCookie = (key) => {
    const expirationDays = 7;
    const date = new Date();
    date.setTime(date.getTime() + expirationDays * 24 * 60 * 60 * 1000);
    document.cookie = `sessionKey=${key}; expires=${date.toUTCString()}; path=/`;
};

const Login = async () => {
    const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
    const headers = {
    Authorization: `Bearer ${apiKey}`,
};

    try {
        const response = await axios.get(url, { headers });
        const user = response.data.records.find(
        (record) =>
            record.fields.Email === LoginEmail.value &&
            record.fields.Password === LoginPassword.value
    );

    if (user) {
        ErrorMessage.value = "";

        let sessionKey;
        let isUnique = false;

        while (!isUnique) {
            sessionKey = generateSessionKey();
            const existingKey = response.data.records.find(
            (record) => record.fields.SessionKey === sessionKey
            );
        if (!existingKey) {
            isUnique = true;
        }
    }

    const updateUrl = `https://api.airtable.com/v0/${baseId}/${tableName}/${user.id}`;
    const updateResponse = await axios.patch(
        updateUrl,
        {
            fields: {
            SessionKey: sessionKey,
            },
        },
        { headers }
    );

    if (updateResponse.status === 200) {

        setSessionCookie(sessionKey);
        triggerNavbarShow();
        router.push("/dashboard");
    } else {
        throw new Error("Failed to update SessionKey in Airtable.");
    }
    } else {
        ErrorMessage.value = "Invalid email or password.";
    }
    } catch (error) {
    console.error("Error during login:", error.response ? error.response.data : error.message);
    ErrorMessage.value = "An error occurred. Please try again later.";
    }
};
function triggerNavbarShow() {
        emit('update-navbar-show', true); // Emit an event with the value `true`
        }
const isLogin = ref(true);
const LoginRegisterToggle = () => {
    isLogin.value = !isLogin.value;
};

const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
const headers = {
    Authorization: `Bearer ${apiKey}`,
};

//Register
    const InputGroup = ref(0)
    //Group 1
    const RegisterFirtsName = ref("");
    const RegisterLastName = ref("");
    const RegisterEmail = ref("");
    const RegisterPassword1 = ref("");
    const RegisterPassword2 = ref("");
    //Group 2
    const RegisterGender = ref("");
    const RegisterBirthDate = ref();
    const RegisterWeight = ref(null);
    const RegisterHeight = ref(null);
    //Group 3
    const RegisterGoal = ref("");
    const RegisterHealthDisab = ref("");
    const RegisterMedicaments = ref("");
    //Group 4
    const RegisterAllergies = ref("");
    const RegisterDiet = ref("");

    const Register = async () => {
  const url = `https://api.airtable.com/v0/${baseId}/${tableName}`;
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  // Überprüfen, ob die E-Mail bereits existiert
  const checkEmailUrl = `${url}?filterByFormula=Email="${RegisterEmail.value}"`;

  try {
    const emailCheckResponse = await axios.get(checkEmailUrl, { headers });
    const existingRecords = emailCheckResponse.data.records;

    if (existingRecords.length > 0) {
      alert("Diese E-Mail-Adresse ist bereits registriert.");
      return; // Registrierung abbrechen
    }

    // Wenn die E-Mail nicht existiert, neuen Benutzer erstellen
    const newUser = {
      fields: {
        FirstName: RegisterFirtsName.value,
        LastName: RegisterLastName.value,
        Email: RegisterEmail.value,
        Password: RegisterPassword1.value,
        Gender: RegisterGender.value,
        BirthDate: RegisterBirthDate.value,
        Goal: RegisterGoal.value,
        Weight: parseFloat(RegisterWeight.value),
        Height: parseFloat(RegisterHeight.value),
        HealthDisab: RegisterHealthDisab.value,
        Medicaments: RegisterMedicaments.value,
        Allergies: RegisterAllergies.value,
        Diet: RegisterDiet.value,
      },
    };

    const response = await axios.post(url, newUser, { headers });
    console.log("User registered successfully:", response.data);
    ShowRegistersucces.value = true;

    // Formularfelder zurücksetzen
    RegisterFirtsName.value = "";
    RegisterLastName.value = "";
    RegisterEmail.value = "";
    RegisterPassword1.value = "";
    RegisterGender.value = "";
    RegisterBirthDate.value = "";
    RegisterGoal.value = "";
    RegisterWeight.value = "";
    RegisterHeight.value = "";
    RegisterHealthDisab.value = "";
    RegisterMedicaments.value = "";
    RegisterAllergies.value = "";
    RegisterDiet.value = "";

    await sleep(3000);
    ShowRegistersucces.value = false;
    router.push("/login");
    LoginRegisterToggle();

    } catch (error) {
        console.error("Error during registration:", error.response?.data || error);
        alert(
            error.response?.data?.error?.message || "An error occurred during registration."
        );
    }
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

</script>

<template>
    <div class="Container">
        <!--Login-->
        <div class="Login" v-if="isLogin">
            <h1>Welcome back!</h1>
                <form class="LoginForm" @submit.prevent="Login">
                    <h1>Enter Data</h1>
                    <div class="Field Email">
                        <img src="../assets/images/icons/Person-Icon.svg" alt="Person Icon" />
                        <input
                            class="InputField"
                            id="email"
                            v-model="LoginEmail"
                            placeholder="Your Email"
                            type="email"
                            required
                        />
                    </div>
                    <div class="Field Password">
                        <img src="../assets/images/icons/Lock-Icon.svg" alt="Lock Icon" />
                        <input
                            class="InputField"
                            id="password"
                            v-model="LoginPassword"
                            placeholder="Your Password"
                            type="password"
                            required
                        />
                    </div>
                    <button class="SubmitButton" type="submit">Submit</button>
                    <p v-if="ErrorMessage" class="Error">{{ ErrorMessage }}</p>
                </form>
                <div class="RegisterBottomButton" @click="LoginRegisterToggle">
                    <h1>Register</h1>
                </div>
            </div>
        <!--Register-->
        <div class="Register" v-if="!isLogin">
            <h1>Register here!</h1>
            <form class="LoginForm"  v-if="!ShowRegistersucces">
                <div class="Group" v-if="InputGroup == 0">
                    <!--Group1-->
                    <h1>Personal Information</h1>
                    <div class="Field FirstName">
                        <img src="..//assets/images/icons/ID-Icon.png" alt="ID Icon" />
                        <input
                            class="InputField"
                            id="firstname"
                            v-model="RegisterFirtsName"
                            placeholder="Firstname"
                            type="text"
                            required
                        />
                    </div>
                    <div class="Field LastName">
                        <img src="..//assets/images/icons/ID-Icon.png" alt="ID Icon" />
                        <input
                            class="InputField"
                            id="lastname"
                            v-model="RegisterLastName"
                            placeholder="Lastname"
                            type="text"
                            required
                        />
                    </div>
                    <div class="Field Email">
                        <img src="../assets/images/icons/Person-Icon.svg" alt="Person Icon" />
                        <input
                            class="InputField"
                            id="email"
                            v-model="RegisterEmail"
                            placeholder="Email"
                            type="email"
                            required
                        />
                    </div>  
                    <div class="Field Password">
                        <img src="../assets/images/icons/Lock-Icon.svg" alt="Lock Icon" />
                        <input
                            class="InputField"
                            id="password1"
                            v-model="RegisterPassword1"
                            placeholder="Password"
                            type="password"
                            required
                        />
                    </div>
                    <div class="Field Password">
                        <img src="../assets/images/icons/Lock-Icon.svg" alt="Lock Icon" />
                        <input
                            class="InputField"
                            id="password2"
                            v-model="RegisterPassword2"
                            placeholder="Password"
                            type="password"
                            required
                        />
                    </div>
                    <button class="SubmitButton" @click="InputGroup = 1">Next</button>
                <p v-if="ErrorMessage" class="Error">{{ ErrorMessage }}</p>
                </div>
                <!--Group2-->
                <div class="Group" v-if="InputGroup == 1">
                    <h1>Physical Attributes</h1>
                    <div class="Field Gender">
                        <img src="../assets/images/icons/Gender-Icon.png" alt="Gender Icon" />
                        <select
                            class="InputField"
                            id="gender"
                            v-model="RegisterGender"
                            name="Gender"
                            placeholder="Gender"
                            type="text"
                            required
                        >
                            <option value="" disabled selected>Select your Gender</option>
                            <option value="Female">Female</option>
                            <option value="male">Male</option>
                            <option value="NAN">Divers</option>
                        </select>
                    </div>
                    <div class="Field BirthDate">
                        <img src="../assets/images/icons/Calendar-Icon.png" alt="Calendar Icon" />
                        <input
                            class="InputField"
                            id="birthdate"
                            v-model="RegisterBirthDate"
                            placeholder="Birthdate"
                            type="date"
                            required
                        />
                    </div>
                    <div class="Field Height">
                        <img src="../assets/images/icons/Height-Icon.png" alt="Height Icon" />
                        <input
                            class="InputField"
                            id="height"
                            v-model="RegisterHeight"
                            placeholder="Height in meters"
                            type="number"
                            required
                        />
                    </div>
                    <div class="Field Weight">
                        <img src="../assets/images/icons/Weight-Icon.png" alt="Weight Icon" />
                        <input
                            class="InputField"
                            id="weight"
                            v-model="RegisterWeight"
                            placeholder="Weight in kg"
                            type="number"
                            required
                        />
                    </div>
                    <button class="SubmitButton" @click="InputGroup = 2">Next</button>
                    <p v-if="ErrorMessage" class="Error">{{ ErrorMessage }}</p>
                </div>
                <!--Group 3-->
                <div class="Group" v-if="InputGroup == 2">
                    <h1>Fitness</h1>
                    <div class="Field Goal">
                        <img src="../assets/images/icons/Goal-Icon.png" alt="Goal Icon" />
                        <select
                            class="InputField"
                            id="goal"
                            v-model="RegisterGoal"
                            name="goal"
                            placeholder="Goal"
                            type="text"
                            required
                        >
                            <option value="" disabled selected>Choose one goal for Healix</option>
                            <option value="weight">Weight Management</option>
                            <option value="muscle">Muscle Building</option>
                            <option value="endurans">Improving Endurance and Stamina</option>
                            <option value="health">Overall Health</option>
                        </select>
                    </div>
                    <div class="Field HealthDisab">
                        <img src="../assets/images/icons/HealthDis-Icon.png" alt="Healthdisab Icon" />
                        <select
                            class="InputField"
                            id="healthdisab"
                            v-model="RegisterHealthDisab"
                            name="healthdisab"
                            placeholder="healthdisab"
                            
                            required
                        >
                            <option value="" disabled selected>Select your healthdisability</option>
                            <option value="NAN">Nothing</option>
                            <option value="cvds">Cardiovascular Diseases</option>
                            <option value="diabetes">Diabetes Mellitus</option>
                            <option value="copd">Respiratory Disorders</option>
                            <option value="neurological">Neurological Disorders</option>
                            <option value="musculo">Musculoskeletal Disorders</option>
                            <option value="oams">oams</option>
                        </select>
                    </div>
                    <div class="Field Medicaments">
                        <img src="../assets/images/icons/Medi-Icon.png" alt="Medi Icon" />
                        <input
                            class="InputField"
                            id="medi"
                            v-model="RegisterMedicaments"
                            placeholder="Medicaments"
                            type="text"
                            required
                        />
                    </div>
                    <button class="SubmitButton" @click="InputGroup = 3">Next</button>
                    <p v-if="ErrorMessage" class="Error">{{ ErrorMessage }}</p>
                </div>
                <div class="Goal" v-if="InputGroup == 3">
                    <h1>Dietary Preferences</h1>
                    <div class="Field Allergies">
                        <img src="../assets/images/icons/Medi-Icon.png" alt="Allergies Icon" />
                        <input
                            class="InputField"
                            id="allergies"
                            v-model="RegisterAllergies"
                            placeholder="Allergies"
                            type="text"
                            required
                        />
                    </div>
                    <div class="Field Diet">
                        <img src="../assets/images/icons/Diet-Icon.png" alt="DIet Icon" />
                        <select
                            class="InputField"
                            id="diet"
                            v-model="RegisterDiet"
                            name="diet"
                            placeholder="Diet"
                            type="text"
                            required
                        >
                            <option value="" disabled selected>Select your diet</option>
                            <option value="weight">All</option>
                            <option value="muscle">Vegetarian</option>
                            <option value="endurans">Vegan</option>
                        </select>
                    </div>
                    <button class="SubmitButton" @click="Register()">Submit</button>
                    <p v-if="ErrorMessage" class="Error">{{ ErrorMessage }}</p>
                </div>
            </form>
            <div class="SuccesfulMessage" v-if="ShowRegistersucces">
                <h1>Your registerd now</h1>
                <h2>Sign in to get full access</h2>
            </div>
            <div class="RegisterBottomButton" @click="LoginRegisterToggle">
                <h1>Login</h1>
            </div>
        </div>
    </div>
</template>

<style>
@import "../assets/components/Login.css";
</style>
