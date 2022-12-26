import Vue from 'vue'
import './css/characterSheet.css'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { createPinia, PiniaVuePlugin } from 'pinia'

Vue.prototype.$signedIn = false;
Vue.prototype.$userData = {};

var signin = localStorage.getItem('signin')
if (signin) {
    var data = JSON.parse(signin)
    Vue.prototype.$signedIn = (data.id && data.email) ? true : false;
    Vue.prototype.$userData = data;
}

Vue.component('CharacterComponent', require('./components/CharacterComponent.vue').default);

Vue.config.productionTip = false

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
    router,
    vuetify,
    render: h => h(App),
    pinia
}).$mount('#app')