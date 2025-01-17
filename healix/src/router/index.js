import { createRouter, createWebHistory } from 'vue-router';

const HomeView = () => import(/* webpackChunkName: "CreateLink" */ '../views/Home.vue');
const Dashboard = () => import(/* webpackChunkName: "CreateLink" */ '../views/Dashboard.vue');
const Login = () => import(/* webpackChunkName: "CreateLink" */ '../views/Login.vue');
const NewActivity = () => import(/* webpackChunkName: "CreateLink" */ '../views/NewActivity.vue');
const Profile = () => import(/* webpackChunkName: "CreateLink" */ '../views/Profile.vue');
import Main from '../components/Dashboard/Main.vue';
import Meals from '../components/Dashboard/Meals.vue';
import Fitness from '../components/Dashboard/Fitness.vue';
import Activity from '../components/Dashboard/Activity.vue';
import NewMeal from '../components/Dashboard/NewMeal.vue';
import NFA from '../components/Dashboard/NFA.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomeView
    },
    {
        path: '/dashboard',
        component: Dashboard,
        children: [
        {
            path: '',
            component: Main // Standardroute für /dashboard
        },
        {
            path: 'meals',
            component: Meals
        },
        {
            path: 'fitness',
            component: Fitness
        },
        {
            path: 'activity',
            component: Activity
        },
        {
            path: 'new-meal',
            component: NewMeal
        },
        {
            path: 'new-fitness',
            component: NFA
        }
        ]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
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