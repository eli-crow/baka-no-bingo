<script setup lang="ts">
import DebugView from './components/DebugView.vue';
import {
  createGameStateMachine,
  provideGameStateMachine,
} from './composables/createGameStateMachine';

import {
  createSocketState,
  provideSocketState,
} from './composables/createSocketState';

const showDebug = import.meta.env.DEV;

const socket = createSocketState();
provideSocketState(socket);

const game = createGameStateMachine(socket);
provideGameStateMachine(game);
</script>

<template>
  <div class="App">
    <router-view v-slot="{ Component }" class="view">
      <transition name="wipe">
        <component :is="Component" />
      </transition>
    </router-view>

    <DebugView v-if="showDebug" />
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
./composables/game
