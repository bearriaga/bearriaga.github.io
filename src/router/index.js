import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CharacterSheetView from '../views/CharacterSheetView.vue'
import InitiativeView from '../views/InitiativeView.vue'
import ResumeView from '../views/ResumeView.vue'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'home',
        component: ResumeView
    },
    {
        path: '/charactersheet',
        name: 'charactersheet',
        component: CharacterSheetView
    },
    {
        path: '/initiative',
        name: 'initiative',
        component: InitiativeView
    },
    {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    },
    {
        path: '/resume',
        name: 'resume',
        component: ResumeView
    },
    {
        path: '/helloworld',
        name: 'helloworld',
        component: HomeView
    }
]

const router = new VueRouter({
    //mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
