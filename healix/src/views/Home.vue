<script setup>

</script>

<template>

    <div id="app" class="container">
      <header class="header">
        <h1>Healix</h1>
        <p>Your Smart Health Coach, Always by Your Side</p>
      </header>
  
      <main>
        <section id="register-login" class="card">
          <h2>Register / Login</h2>
          <button class="btn-primary">Register</button>
          <button class="btn-secondary">Login</button>
        </section>
  
        <section id="services" class="card">
          <h2>Services</h2>
          <ul>
            <li>You lean back and we track</li>
            <li>Healix tracks your fitness activities</li>
            <li>Easy and simple: Graphs of your progress</li>
          </ul>
        </section>
  
        <section id="did-you-know" class="card">
          <h2>Did you know?</h2>
          <p>
            Maintaining a healthy diet and exercise routine can increase life expectancy by up to 30%.
          </p>
        </section>
  
      </main>
    </div>

    <style scoped>
.container {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2rem;
  color: #4caf50;
}

.header p {
  font-size: 1.2rem;
  color: #555;
}

.card {
  background: #fff;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}

.btn-primary {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  margin-right: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-secondary {
  background-color: #9e9e9e;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.btn-primary:hover,
.btn-secondary:hover {
  opacity: 0.8;
}

.dashboard-stats {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.dashboard-stats div {
  text-align: center;
}

.dashboard-stats h3 {
  font-size: 1.8rem;
  color: #4caf50;
}

.dashboard-actions {
  display: flex;
  justify-content: space-around;
}
</style>

</template>