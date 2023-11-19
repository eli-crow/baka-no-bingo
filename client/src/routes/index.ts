import storage from '@/services/storage';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
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
      component: () => import('./game/game.vue'),
      beforeEnter: (to, from, next) => {
        if (storage.playerId && storage.gameCode) {
          next();
        } else {
          next('/');
        }
      },
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
    {
      path: '/anime',
      name: 'Anime',
      component: () => import('./anime.vue'),
    },
  ],
});

export default router;
