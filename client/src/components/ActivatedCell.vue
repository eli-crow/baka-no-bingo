<script setup lang="ts">
import { createProposedCellState } from '@/composables/createActivatedCellState';
import { ref, watch } from 'vue';
import Avatar from './Avatar.vue';
import BingoBoard3Preview from './BingoBoard3Preview.vue';
import Button from './Button.vue';
import Tile from './Tile.vue';

const state = createProposedCellState();

const localState = ref(state.info);

watch(
  () => state.info,
  (info, old) => {
    // if ((info && old && info.key === old.key) || info === old) {
    //   return;
    // }
    document.startViewTransition(() => {
      localState.value = info;
    });
  }
);
</script>

<template>
  <Teleport to="body">
    <div class="ActivatedCell" v-if="localState">
      <div class="cell">
        <Tile class="tile">{{ localState.text }}</Tile>
        <Avatar class="avatar" :avatar="localState.avatar" />
        <BingoBoard3Preview class="board" :board="localState.board" />
      </div>
      <div class="buttons">
        <Button color="green" @click="state.accept">👍</Button>
        <Button color="red" @click="state.deny">👎</Button>
      </div>
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
</style>

<style scoped>
.ActivatedCell {
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
</style>
