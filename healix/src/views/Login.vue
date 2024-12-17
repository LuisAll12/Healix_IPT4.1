<script setup>
function LoginRegisterToggle(){
    console.log("test");
}
</script>
<template>
    <div class="Container">
        <div class="Login">
            <h1>Welcome back!</h1>
            <form class="LoginForm">
                <div class="Email Field">
                    <img src="../assets/images/icons/Person-Icon.svg" alt="">
                    <input 
                    class="InputField" 
                    id="email" 
                    v-model="LoginEmail" 
                    placeholder="Your Email"
                    type="email" 
                    required    >
                </div>
                <div class="Password Field">
                    <img src="../assets/images/icons/Lock-Icon.svg" alt="">
                    <input 
                    class="InputField"
                    id="password"
                    v-model="LoginPassword"
                    placeholder="Your Password"
                    type="password"
                    required    >
                </div>
                <button class="SubmitButton" type="submit">Submit</button>
            </form>
            <div class="RegisterBottomButton" @click="LoginRegisterToggle()">
                <h1>Register</h1>
            </div>
        </div>
    </div>
</template>
<style>
    @import '../assets/components/Login.css';
</style>