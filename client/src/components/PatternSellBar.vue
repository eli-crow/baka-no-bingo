<script setup lang="ts">
import { useBoardState } from '@/composables/createBoardState';
import { useGameStateMachine } from '@/composables/createGameStateMachine';
import { PATTERNS } from '@shared';
import PatternIcon from './PatternIcon.vue';

const game = useGameStateMachine();
const board = useBoardState();
</script>

<template>
  <div class="PatternSellBar" v-if="'player' in game.state">
    <div class="title"> 売る Sell! </div>
    <div class="pattern-group">
      <div
        v-for="p in board.sellablePatternIds"
        :key="p"
        class="pattern"
        @click="game.requestSellPattern(p)"
      >
        <PatternIcon class="pattern-icon" :pattern-id="p" />
        <span class="pattern-score">+{{ PATTERNS[p].score }}</span>
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
../composables/game
