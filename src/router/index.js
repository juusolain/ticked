import Vue from 'vue'
import VueRouter from 'vue-router'

import net from '@/modules/net'
import store from '@/modules/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: require('@/views/Login').default,
    props: true
  },
  {
    path: '/main',
    name: 'Main',
    component: require('@/views/MainPage').default,
    props: true
  },
  {
    path: '/payments',
    name: 'Payments',
    component: require('@/views/Payments').default,
    props: true
  },
  {
    path: '/modeSelect',
    name: 'ModeSelect',
    component: require('@/views/ModeSelect').default,
    props: true
  },
  {
    path: '/',
    name: 'redirect',
    redirect: to => {
      const mode = store.getMode()
      console.log(mode)
      if (mode === 'online') {
        if (net.isLoggedIn()) {
          return {
            name: 'Main'
          }
        } else {
          return {
            name: 'Login'
          }
        }
      } else if (mode === 'local') {
        return {
          name: 'Main'
        }
      } else {
        return {
          name: 'ModeSelect'
        }
      }
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
