import Vue from 'vue'
import VueGlobalVar from 'vue-global-var'
import axios from 'axios'

import Buefy from 'buefy'
import './custom.scss'

import App from './App'
import router from './router'
import store from './store'

import Net from './modules/net'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
const apiAddress = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/'
  : 'https://ticked-server.herokuapp.com/'
const net = new Net(apiAddress)

Vue.config.productionTip = false

Vue.use(Buefy)

Vue.use(VueGlobalVar, {
  // store,
  globals: {
    net: net
  }
})

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
  el: '#app',
  data: {
    // declare message with an empty value
    tasks: [{
      taskid: 'testid',
      name: 'Name',
      description: 'Description'
    }]
  }
}).$mount('#app')
