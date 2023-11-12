<script setup lang="ts">
import { Board, getResolvedCells } from '@shared';
import { computed } from 'vue';

const props = defineProps<{
  board: Board;
}>();

const cells = computed(() =>
  getResolvedCells(props.board.cells, props.board.selectedIndices)
);
</script>

<template>
  <div class="board">
    <div
      v-for="cell in cells"
      class="cell"
      :key="cell.key"
      :data-selected="cell.selected"
    />
  </div>
</template>

<style scoped>
.board {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 2rem;
  height: 2rem;
  position: relative;
  background-color: var(--black);
  border: solid 1px var(--black);
  border-radius: 3px;
}

.cell {
  border: solid 1px var(--black);
  background: white;
  border-radius: 3px;
}

.cell[data-selected='true'] {
  background-color: var(--red);
}
</style>
