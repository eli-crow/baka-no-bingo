<script setup lang="ts">
import { x } from '@/components/Icon';
import Icon from '@/components/Icon/Icon.vue';
import PlayerOptionsEditor from '@/components/PlayerOptionsEditor.vue';
import TileButton from '@/components/TileButton.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import router from '@/routes';
import { PlayerOptions } from '@shared';
import { reactive } from 'vue';

const game = useClientGameState();

const options = reactive<PlayerOptions>({ avatar: 'cal' });

function host() {
  game
    .host(options)
    .then(() => {
      router.push('/game');
    })
    .catch(e => {
      console.error(e);
    });
}
</script>

<template>
  <div class="page">
    <h1 class="title">Host</h1>
    <router-link to="/">
      <Icon :icon="x" />
    </router-link>

    <form class="content" @submit.prevent="host">
      <PlayerOptionsEditor v-model="options" />
      <TileButton class="host" type="submit" color="yellow">Host</TileButton>
    </form>
  </div>
</template>

<style scoped>
.page {
  --ambient: var(--blue);
  --ambient-dark: var(--blue-dark);
  background-color: var(--ambient);
  color: var(--white);
  display: grid;
  grid-template:
    'title close' 3rem
    'content content' 1fr
    / 1fr 3rem;
  padding: 1rem;
  gap: 1rem;
}

.title {
  grid-area: title;
  margin: 0;
  align-self: center;
  justify-self: start;
  padding-left: 1rem;
  padding-right: 1rem;
}

.close {
  grid-area: close;
  display: flex;
  align-items: center;
  justify-self: center;
  color: inherit;
}

.content {
  grid-area: content;
}

.host {
  width: 100%;
  margin-top: 1rem;
}
</style>
