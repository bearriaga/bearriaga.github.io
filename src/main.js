import Vue from 'vue'
import './css/characterSheet.css'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.config.productionTip = false

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
    router,
    vuetify,
    render: h => h(App),
    pinia
}).$mount('#app')