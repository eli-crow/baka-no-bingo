<script setup lang="ts">
import AvatarSelector from '@/components/AvatarSelector.vue';
import { x } from '@/components/Icon';
import Icon from '@/components/Icon/Icon.vue';
import Tile from '@/components/Tile.vue';
import { useGameStateMachine } from '@/composables/createGameStateMachine';
import router from '@/routes';
import { PlayerDataOptions } from '@shared';
import { reactive, watchEffect } from 'vue';

const game = useGameStateMachine();

const options = reactive<PlayerDataOptions>({});

function host() {
  game.host(options);
}

watchEffect(() => {
  if (game.state.type === 'joined') {
    router.push('/game');
  }
});
</script>

<template>
  <div class="Host">
    <h1 class="title">Host</h1>
    <router-link to="/">
      <Icon :icon="x" />
    </router-link>

    <div class="content">
      <Tile class="player-info" color="blue">
        <AvatarSelector v-model="options.avatar" />
        <input v-model.lazy.trim="options.name" type="text" />
        {{ options.avatar }}
      </Tile>

      <button class="host tile tile--yellow" @click="host">Host</button>
    </div>
  </div>
</template>

<style scoped>
.Host {
  --shadow-color: var(--blue-dark);
  background-color: var(--blue);
  color: var(--white);
  display: grid;
  grid-template:
    'title close' 3rem
    'content content' 1fr
    / 1fr 3rem;
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
  padding-left: 1rem;
  padding-right: 1rem;
}

.player-info {
  padding: 1rem;
}

.host {
  color: var(--black);
}
</style>
../composables/game
