<script setup lang="ts">
import {
  BakaBubble,
  createProposedCellState,
} from '@/composables/createProposedCellState';
import { ref, watch } from 'vue';
import Avatar from './Avatar.vue';
import BingoBoard3Preview from './BingoBoard3Preview.vue';
import Button from './Button.vue';
import Tile from './Tile.vue';

const state = createProposedCellState();

const info = ref(state.info);
const baka = ref<BakaBubble | null>(null);

watch(
  () => state.info,
  value => {
    document.startViewTransition(() => {
      info.value = value;
    });
  }
);

watch(
  () => state.baka,
  value => {
    document.startViewTransition(() => {
      baka.value = value;
    });
  }
);
</script>

<template>
  <Teleport to="body">
    <div class="ProposedCell" v-if="info">
      <div class="cell">
        <Tile class="tile">{{ info.text }}</Tile>
        <Avatar class="avatar" :avatar="info.avatar" />
        <BingoBoard3Preview class="board" :board="info.board" />
      </div>
      <div class="buttons">
        <Button color="green" @click="state.accept">👍</Button>
        <Button color="red" @click="state.deny">👎</Button>
      </div>
    </div>

    <div
      v-if="baka"
      class="baka"
      :style="{
        '--x': baka.x,
        '--y': baka.y,
        '--rotation': baka.rotation,
      }"
    >
      <img src="@/assets/images/baka.svg" alt="Baka!" class="baka-image" />
    </div>
  </Teleport>
</template>

<style>
::view-transition-new(activated-cell) {
  animation: activated-cell-new both 0.25s ease-out;
}
::view-transition-old(activated-cell) {
  animation: activated-cell-old both 0.25s ease-out;
}
@keyframes activated-cell-new {
  from {
    transform: translateY(100%);
  }
  to {
    transform: none;
  }
}
@keyframes activated-cell-old {
  from {
    transform: none;
  }
  to {
    transform: translateY(100%);
  }
}

::view-transition-old(baka) {
  animation: baka-old 0.25s both var(--spring-easing);
}
::view-transition-new(baka) {
  animation: baka-new 0.35s both var(--spring-easing);
}
@keyframes baka-old {
  from {
    transform: none;
    opacity: 1;
  }
  to {
    transform: scale(0.5);
    opacity: 0;
  }
}
@keyframes baka-new {
  from {
    transform: scale(0.5);
    opacity: 0;
  }
  to {
    transform: none;
    opacity: 1;
  }
}
</style>

<style scoped>
.ProposedCell {
  position: fixed;
  padding: 1rem 1rem 1.5rem;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  --ambient: var(--blue);
  --ambient-dark: var(--blue-dark);
  background-color: var(--ambient);
  display: flex;
  gap: 4rem;
  view-transition-name: activated-cell;
}

.cell {
  position: relative;
  margin-top: -4rem;
}

.tile {
  width: 8rem;
  height: 8rem;
}

.avatar {
  position: absolute;
  z-index: 1001;
  top: -1rem;
  right: -2.5rem;
  width: 4rem;
}

.board {
  position: absolute;
  z-index: 1001;
  top: 4rem;
  right: -2rem;
  width: 3rem;
  height: 3rem;
}

.buttons {
  display: flex;
  gap: 1rem;
  flex: 1 0 0;
  align-items: start;
}

.buttons > * {
  flex: 1 0 0;
}

.baka {
  position: fixed;
  left: calc(100vw * (0.1 + var(--x) * 0.8) - 5rem);
  top: calc(100vh * (0.1 + var(--y) * 0.8) - 3rem);
  z-index: 1001;
  pointer-events: none;
  view-transition-name: baka;
}

.baka-image {
  transform-origin: center;
  transform: rotate(var(--rotation));
  height: 10rem;
  width: auto;
}
</style>
