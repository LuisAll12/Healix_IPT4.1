import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import(/* webpackChunkName: "CreateLink" */ '../views/Home.vue');
const Dashboard = () => import(/* webpackChunkName: "CreateLink" */ '../views/Dashboard.vue');
const Login = () => import(/* webpackChunkName: "CreateLink" */ '../views/Login.vue');
const NewActivity = () => import(/* webpackChunkName: "CreateLink" */ '../views/NewActivity.vue');
const NewMeal = () => import(/* webpackChunkName: "CreateLink" */ '../views/NewMeal.vue');
const Profile = () => import(/* webpackChunkName: "CreateLink" */ '../views/Profile.vue');

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