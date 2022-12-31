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

Vue.mixin({
    data() {
        return {
            snackbar: {
                show: false,
                text: ''
            }
        }
    },
    methods: {
        determineSuccesses(dieResult) {
            if (dieResult < 4)
                return 0
            if (dieResult < 6)
                return 1
            if (dieResult >= 6)
                return 2
        },
        getRandomIntInclusive: function (min, max) {
            min = Math.ceil(min)
            max = Math.floor(max)
            return Math.floor(Math.random() * (max - min + 1) + min)
        },
        rollDice(diceToRoll) {
            let result = {
                diceResults: [],
                successes: 0
            }

            for (var i = 0; i < diceToRoll; i++) {
                var dieResult = this.getRandomIntInclusive(1, 6)
                result.diceResults.push(dieResult)
                result.successes += this.determineSuccesses(dieResult)
            }

            return result
        },
        showSnackbar(text) {
            this.snackbar = {
                show: true,
                text: text
            }
        }
    }
})

Vue.config.productionTip = false

Vue.use(PiniaVuePlugin)
const pinia = createPinia()

new Vue({
    router,
    vuetify,
    render: h => h(App),
    pinia
}).$mount('#app')