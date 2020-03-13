import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: require('@/components/Login').default,
      props: true
    },
    {
      path: '/',
      redirect: '/main',
      props: true
    },
    {
      path: '/main',
      name: 'Main',
      component: require('@/components/MainPage').default,
      props: true
    }

  ]
})
