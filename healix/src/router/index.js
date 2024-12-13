import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import(/* webpackChunkName: "Home" */ '../views/Home.vue');
const Dashboard = () => import(/* webpackChunkName: "Dashboard" */ '../views/Dashboard.vue');
const Login = () => import(/* webpackChunkName: "Login" */ '../views/Login.vue');
const NewActivity = () => import(/* webpackChunkName: "NewActivity" */ '../views/NewActivity.vue');
const NewMeal = () => import(/* webpackChunkName: "NewMeal" */ '../views/NewMeal.vue');
const Profile = () => import(/* webpackChunkName: "Profile" */ '../views/Profile.vue');

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/newactivity',
        name: 'New-Activity',
        component: NewActivity
    },
    {
        path: '/newmeal',
        name: 'New-Meal',
        component: NewMeal
    },
    {
        path: '/profile',
        name: 'Profile',
        component: Profile
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});


export default router;