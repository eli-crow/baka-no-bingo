import { createRouter, createWebHistory } from 'vue-router';

export default createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: () => import('./home.vue'),
    },
    {
      path: '/game',
      name: 'Game',
      component: () => import('./game.vue'),
    },
    {
      path: '/host',
      name: 'Host',
      component: () => import('./host.vue'),
    },
    {
      path: '/join',
      name: 'Join',
      component: () => import('./join.vue'),
    },
  ],
});
