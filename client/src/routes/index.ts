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
      beforeEnter: () => {
        if (!(storage.playerId && storage.gameCode)) {
          return '/';
        }
      },
      children: [
        {
          path: 'spin',
          name: 'Spin',
          component: () => import('./spin.vue'),
        },
      ],
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

export default router;
