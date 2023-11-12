<script setup lang="ts">
import { useClientGameState } from '@/composables/createClientGameState';
import { CELL_PATTERNS } from '@shared';
import PatternIcon from './PatternIcon.vue';

const game = useClientGameState();
</script>

<template>
  <div class="PatternSellBar">
    <div class="title"> 売る Sell! </div>
    <div class="pattern-group">
      <div
        v-for="p in game.sellablePatternIds"
        :key="p"
        class="pattern"
        @click="game.sellPattern(p)"
      >
        <PatternIcon class="pattern-icon" :pattern-id="p" />
        <span class="pattern-score">+{{ CELL_PATTERNS[p].score }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.PatternSellBar {
  background: var(--blue);
  display: flex;
  align-items: center;
  font: var(--font-title);
  padding-left: 1rem;
  height: 3.5rem;
}

.title {
  color: white;
  white-space: nowrap;
  flex: 0 0 auto;
  margin-right: 1rem;
}

.pattern-group {
  display: flex;
  overflow-x: hidden;
  flex: 1 0 0;
}

.pattern {
  background: white;
  padding: 0.5rem 1rem;
  border-radius: 99999px;
  display: flex;
  align-items: center;
  font: var(--font-default);
  margin-right: 0.5rem;
  cursor: pointer;
}

.pattern-icon {
  --active-color: var(--green-light) !important;
  margin-right: 0.5rem;
}

.pattern-score {
  color: var(--green-light);
  font-weight: 700;
}
</style>
