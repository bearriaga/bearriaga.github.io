import Vue from 'vue'
import VueRouter from 'vue-router'
//import HomeView from '../views/HomeView.vue'
import CharacterSheetView from '../views/CharacterSheetView.vue'
import DMView from '../views/DMView.vue'
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
        path: '/dm',
        name: 'DM Page',
        component: DMView
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
        path: '/wiki',
        name: 'Wiki',
        component: () => import('../views/WikiView.vue')
    },
    {
        path: '/workout',
        name: 'Workout',
        component: () => import('../views/WorkoutView.vue')
    },
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
