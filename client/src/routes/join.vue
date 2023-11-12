<script setup lang="ts">
import GameCodeEditor from '@/components/GameCodeEditor.vue';
import Icon, { x } from '@/components/Icon';
import PlayerOptionsEditor from '@/components/PlayerOptionsEditor.vue';
import TileButton from '@/components/TileButton.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import { PlayerOptions } from '@shared';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const game = useClientGameState();
const router = useRouter();

const code = ref('');
const options = reactive<PlayerOptions>({ avatar: 'cal' });

function join() {
  game
    .join(code.value, options)
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
    <h1 class="title">Join</h1>
    <router-link class="close" to="/">
      <Icon :icon="x" />
    </router-link>

    <form class="content" @submit.prevent="join">
      <GameCodeEditor v-model="code" />
      <PlayerOptionsEditor v-model="options" />
      <TileButton class="join" type="submit" color="yellow">Join</TileButton>
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

.join {
  width: 100%;
  margin-top: 1rem;
}
</style>
