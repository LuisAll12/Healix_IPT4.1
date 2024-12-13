<template> 
    <template>
      <nav class="login">
          <div class="container">
              <router-link to="/" class="logo">Login</router-link>
                  <li><a href="#Home">Healix</a></li>
                  <li><router-link to="/login">Register</router-link></li>
          </div>
          <div class="form-group">
            <label class="form-label" for="email">E-Mail</label>
            <input class="form-input" type="email" id="email" />
            </div>

            <div class="form-group">
            <label class="form-label" for="password">Passwort</label>
            <input class="form-input" type="password" id="password" />
            </div>

            <div class="form-group">
            <label class="form-label" for="firstname">Firstname</label>
            <input class="form-input" type="firstname" id="firstname" />
            </div>

            <div class="form-group">
            <label class="form-label" for="lastname">Lastname</label>
            <input class="form-input" type="lastname" id="lastname" />
            </div>
        
            <div class="form-group">
            <label class="form-label" for="date">Birthdate</label>
            <input class="form-input" type="date" id="date" />
            </div>

           
            <div class="form-group">
            <label class="form-label" for="goal">Enter your fitness goal</label>
            <input class="form-input" type="input" id="goal" />
            </div>


  
            <div class="form-group">
            <button class="btn btn--primary btn--block">
              Register
            </button>
          </div>
          
  
    
  
      </nav>
  </template>