<script setup lang="ts">
import { createActivatedCellState } from '@/composables/createActivatedCellState';
import Avatar from './Avatar.vue';
import BingoBoard3Preview from './BingoBoard3Preview.vue';
import Tile from './Tile.vue';

const state = createActivatedCellState();
</script>

<template>
  <Teleport to="body">
    <Transition name="pop-up">
      <div
        class="ActivatedCell"
        v-if="state.player && state.cell && state.cell.type === 'trope'"
      >
        <div class="inner">
          <Tile class="tile">{{ state.cell.text }}</Tile>
          <Avatar class="avatar" :avatar="state.player.avatar" />
          <BingoBoard3Preview class="board" :board="state.player.board" />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.ActivatedCell {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  z-index: 1000;
}

.inner {
  position: relative;
}

.tile {
  width: 8rem;
  height: 8rem;
}

.avatar {
  position: absolute;
  z-index: 1001;
  top: -20%;
  left: 80%;
  width: 6rem;
}

.board {
  position: absolute;
  z-index: 1001;
  top: 80%;
  left: 50%;
  width: 4rem;
  height: 4rem;
}
</style>
