import Vue from 'vue'
import Router from 'vue-router'
import MainPage from '@/pages/MainPage'
import GamePage from '@/pages/GamePage'
import DataPage from '@/pages/DataPage'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: MainPage,
    },
    {
      path: '/game',
      name: 'Game',
      props: true,
      component: GamePage,
    },
    {
      path: '/data',
      name: 'Data',
      props: true,
      component: DataPage,
    }
  ]
})
