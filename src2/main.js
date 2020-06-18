import '@mdi/font/css/materialdesignicons.css'

import Vue from 'vue'
import VueGlobalVar from 'vue-global-var'
import axios from 'axios'
import i18n from '@/../i18n'

import Buefy from 'buefy'
import './custom.scss'

import App from './App'
import router from './router'

import backend from '@/modules/backend'
import store from '@/modules/store'
import net from '@/modules/net'
import auth from '@/modules/auth'
import database from '@/modules/database'

import ElectronStore from 'electron-store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios

if (process.env.NODE_ENV === 'development') {
  window.store = store
  window.router = router
  window.backend = backend
  window.net = net
  window.auth = auth
  window.database = database
  window.electronstore = new ElectronStore()
}

Vue.config.productionTip = false

Vue.use(Buefy)

Vue.use(VueGlobalVar, {
  // store,
  globals: {
    test123: 'test123'
  }
})

/* eslint-disable no-new */
export default new Vue({
  el: '#app',
  components: { App },
  router,
  i18n,
  template: '<App/>'
}).$mount('#app')
