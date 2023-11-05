<script setup lang="ts">
import { ResolvedCell } from '@/composables/createBoardState';

const props = defineProps<{
  cells: ResolvedCell[];
}>();
</script>

<template>
  <div class="pattern-chips">
    <div
      v-for="cell in props.cells"
      :key="cell.key"
      class="pattern-chip"
      :data-selected="cell.selected"
    />
  </div>
</template>

<style scoped>
.pattern-chips {
  width: 2rem;
  height: 2rem;
  position: relative;
  background-color: var(--black);
  border: solid 1px var(--black);
  border-radius: 3px;
}

.pattern-chip {
  float: left;
  width: 33.333333%;
  height: 33.333333%;
  border: solid 1px var(--black);
  background: var(--white);
  border-radius: 3px;
}
.pattern-chip[data-selected] {
  background-color: var(--red);
}
</style>
