import Vue from 'vue'
import VueGlobalVar from 'vue-global-var'
import axios from 'axios'

import Buefy from 'buefy'
import './custom.scss'

import App from './App'
import router from './router'
import store from './store'

import net from './modules/net'
console.log(net)
window.net = net

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.use(Buefy)

Vue.use(VueGlobalVar, {
  // store,
  globals: {
    test123: 'test123'
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  el: '#app'
}).$mount('#app')
