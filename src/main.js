import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import VueSweetalert2 from 'vue-sweetalert2'
import store from './store'
import App from './App.vue'
import myIcons from './assets/mdi'
import 'vuetify/src/stylus/app.styl'

Vue.config.productionTip = false

Vue.use(Vuetify, {
  icons: myIcons
})
Vue.use(VueSweetalert2, {
  heightAuto: false
})

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
