import Vue from 'vue'
import Router from 'vue-router'

import net from '@/modules/net'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login').default,
      props: true
    },
    {
      path: '/',
      name: 'Main',
      component: require('@/components/MainPage').default,
      meta: { requiresLogin: true },
      props: true
    }
  ]
})

router.beforeEach((to, from, next) => {
  console.log(net.isLoggedIn())
  if (to.matched.some(record => record.meta.requiresLogin) && !net.isLoggedIn()) {
    // You can use store variable here to access globalError or commit mutation
    next('/login')
    console.log('redirecting to login')
  } else if (to.matched.some(record => record.name === 'name') && net.isLoggedIn()) {
    console.log('redirecting to main')
    next('/')
  } else {
    next()
  }
})

export default router
