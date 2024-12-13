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
            <div class="form-error">
              Ungültige E-Mail
            </div>
            <div class="form-group">
            <label class="form-label" for="email">Passwort</label>
            <input class="form-input" type="email" id="email" />
            <div class="form-error">
              Ungültiges Passwort
            </div>
  
            <div class="form-group">
            <button class="btn btn--primary btn--block">
              Login
            </button>
          </div>
          </div>
  
          </div>
  
      </nav>
  </template>