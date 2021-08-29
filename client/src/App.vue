<script setup>
import { computed } from "vue";
import DebugView from './components/DebugView.vue'
import game from './store/game';

const showDebug = import.meta.env.DEV

const ambientColorStyle = computed(() => {
  return {
    '--ambient': `var(--${game.boughtTile ? 'green' :
      game.sellablePatterns.length ? 'blue' :
        'yellow'
      })`,
    '--ambient-dark': `var(--${game.boughtTile ? 'green-dark' :
      game.sellablePatterns.length ? 'blue-dark' :
        'yellow-dark'
      })`,
  };
})
</script>

<template>
  <div class="App" :style="ambientColorStyle">
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

/* .App::after {
  position: fixed;
  z-index: 1000;
  content: "";
  top: 1px;
  left: 1px;
  width: calc(100% - 2px);
  height: calc(100% - 2px);
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), 50%, black);
  opacity: 0.25;
  mix-blend-mode: overlay;
  pointer-events: none;
} */

.view {
  flex: 1 0 auto;
  padding-bottom: 1rem;
}
</style>