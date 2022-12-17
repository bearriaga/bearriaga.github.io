import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import CharacterSheetView from '../views/CharacterSheetView.vue'
import InitiativeView from '../views/InitiativeView.vue'
import ResumeView from '../views/ResumeView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Home',
        component: ResumeView
    },
    {
        path: '/charactersheet',
        name: 'Character Sheet',
        component: CharacterSheetView
    },
    {
        path: '/initiative',
        name: 'Initiative',
        component: InitiativeView
    },
    {
        path: '/resume',
        name: 'Resume',
        component: ResumeView
    },
    {
        path: '/workout',
        name: 'Workout',
        component: () => import('../views/WorkoutView.vue')
    }
]

const router = new VueRouter({
    //mode: 'history',
    base: process.env.BASE_URL,
    routes
})

router.afterEach((to) => {
    Vue.nextTick(() => {
        document.title = to.name;
    });
});

export default router
