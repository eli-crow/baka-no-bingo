<script setup lang="ts">
import DebugView from './components/DebugView.vue';
import {
  createClientGameState,
  provideClientGameState,
} from './composables/createClientGameState';

import {
  createSocketState,
  provideSocketState,
} from './composables/createSocketState';

const SHOW_DEBUG = import.meta.env.DEV;

const socket = createSocketState();
provideSocketState(socket);

const game = createClientGameState(socket);
provideClientGameState(game);
</script>

<template>
  <div class="App">
    <router-view v-slot="{ Component }" class="view">
      <transition name="wipe">
        <component :is="Component" />
      </transition>
    </router-view>

    <DebugView v-if="SHOW_DEBUG" />
  </div>
</template>

<style scoped>
.App {
  flex: 1 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
}

.view {
  flex: 1 0 auto;
  padding-bottom: 1rem;
}
</style>
