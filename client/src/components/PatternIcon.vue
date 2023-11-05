<script setup lang="ts">
import { CellPatternId } from '@shared';
import { computed } from 'vue';

const PATTERN_PATHS: Record<CellPatternId, string> = {
  all: 'M 0,0  L 0,1  L 1,1  L 1,0  Z M 0,0  L 1,1  M 0,1  L 1,0',
  row1: 'M 0,0  L 1,0',
  row2: 'M 0,0.5  L 1,0.5',
  row3: 'M 0,1  L 1,1',
  column1: 'M 0,0  L 0,1',
  column2: 'M 0.5,0  L 0.5,1',
  column3: 'M 1,0  L 1,1',
  diagonal1: 'M 0,0  L 1,1',
  diagonal2: 'M 0,1  L 1,0',
  x: 'M 0,0  L 1,1  M 0,1  L 1,0',
  plus: 'M 0,0.5  L 1,0.5  M 0.5,0  L 0.5,1',
};

const GRID_LINES = [
  PATTERN_PATHS.all,
  PATTERN_PATHS.row2,
  PATTERN_PATHS.column2,
  PATTERN_PATHS.diagonal1,
  PATTERN_PATHS.diagonal2,
];

const props = defineProps<{
  patternId: CellPatternId;
}>();

const patternLines = computed(() => PATTERN_PATHS[props.patternId]);
</script>

<template>
  <svg
    class="PatternIcon"
    width="1px"
    height="1px"
    viewBox="0 0 1 1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class="grid">
      <path v-for="(path, i) in GRID_LINES" :key="i" :d="path" class="line" />
    </g>
    <path :d="patternLines" class="line-active" />
  </svg>
</template>

<style scoped>
.PatternIcon {
  --grid-color: var(--black);
  --active-color: var(--color-text-dark);
  overflow: visible;
  display: inline-block;
  width: 1.33333rem;
  height: 1.33333rem;
}

.line {
  fill: none;
  stroke-width: 2px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: var(--grid-color);
  vector-effect: non-scaling-stroke;
}

.grid {
  opacity: 0.08;
}

.line-active {
  fill: none;
  stroke-width: 3.5px;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke: var(--active-color);
  vector-effect: non-scaling-stroke;
}
</style>
