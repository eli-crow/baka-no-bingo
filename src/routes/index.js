import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component:  () => import('./main.vue'),
    },
    {
      path: '/game',
      name: 'Game',
      props: true,
      component: () => import('./game.vue'),
    }
  ]
})
