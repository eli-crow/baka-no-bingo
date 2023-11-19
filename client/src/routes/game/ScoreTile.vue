<script lang="ts" setup>
import Tile from '@/components/Tile.vue';
import { useClientGameState } from '@/composables/createClientGameState';

const game = useClientGameState();
</script>

<template>
  <Tile class="ScoreTile">
    <div class="content">
      <div class="score">{{ game.player?.score }}</div>
    </div>
  </Tile>
</template>

<style scoped>
.content {
  position: relative;
  text-align: right;
  display: flex;
  align-items: center;
  font: var(--font-title);
  font-size: 1.5rem;
  line-height: 1;
  justify-content: flex-end;
  padding-right: 8rem;
  padding-left: 0.5rem;
}

.score {
  padding-right: 0.75rem;
  border-right: solid 1px var(--gray-light);
}

.rank-button {
  padding: 8px 16px 8px 12px;
  font-size: 24px;
}

.bubble {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
