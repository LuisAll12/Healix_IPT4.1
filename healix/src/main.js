import { createApp } from 'vue'
import './assets/global.css'
import App from './App.vue'
import router from './router/index';

createApp(App).use(router).mount('#app');
