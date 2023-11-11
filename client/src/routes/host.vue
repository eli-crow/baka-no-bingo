<script setup lang="ts">
import AvatarSelector from '@/components/AvatarSelector.vue';
import Button from '@/components/Button.vue';
import { x } from '@/components/Icon';
import Icon from '@/components/Icon/Icon.vue';
import Tile from '@/components/Tile.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import router from '@/routes';
import { PlayerDataOptions } from '@shared';
import { reactive } from 'vue';

const game = useClientGameState();

const options = reactive<PlayerDataOptions>({});

function host() {
  game.host(options).then(() => {
    router.push('/game');
  });
}
</script>

<template>
  <div class="Host">
    <h1 class="title">Host</h1>
    <router-link to="/">
      <Icon :icon="x" />
    </router-link>

    <div class="content">
      <Tile color="blue">
        <div class="player-info">
          <p>Choose your Avatar</p>
          <AvatarSelector v-model="options.avatar" class="avatar-selector" />
          <div class="player-inputs">
            <input v-model.lazy.trim="options.name" type="text" />
          </div>
        </div>
        <Button class="host tile tile--yellow" @click="host">Host</Button>
      </Tile>
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
  padding: 1.5rem;
}

.player-inputs {
  position: relative;
  z-index: 4;
}

.avatar-selector {
  margin: 2rem 0;
}

.host {
  color: var(--black);
}
</style>
