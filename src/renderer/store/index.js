import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    loggedIn: false
  },
  mutations: {
    setLoggedIn (state, newLoggedIn) {
      state.loggedIn = newLoggedIn
    }
  },
  strict: process.env.NODE_ENV !== 'production'
})

export default store
