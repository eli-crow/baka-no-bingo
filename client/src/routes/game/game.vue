<script lang="ts" setup>
import BingoBoard3 from '@/components/BingoBoard3.vue';
import Icon, { chevronLeft } from '@/components/Icon';
import PatternLegend from '@/components/PatternLegend.vue';
import PatternSellBar from '@/components/PatternSellBar.vue';
import PlayerPresence from '@/components/PlayerPresence.vue';
import ProposedCell from '@/components/ProposedCell.vue';
import Tile from '@/components/Tile.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import router from '@/routes';
import ScoreTile from './ScoreTile.vue';

const game = useClientGameState();

function leave() {
  game.leave();
  router.push('/');
}
</script>

<template>
  <div class="GamePage">
    <header class="header">
      <Tile class="room-tile" color="yellow">
        <div class="room">
          <button class="back" @click="leave">
            <Icon :icon="chevronLeft" />
          </button>
          <p class="room-details">
            <span class="room-title">Room</span>
            <span class="room-id">{{ game.code }}</span>
          </p>
        </div>
      </Tile>

      <ScoreTile class="score" />
    </header>

    <div class="board-container">
      <BingoBoard3 :cells="game.cells" @select="i => game.toggleCell(i)" />
    </div>

    <PatternSellBar v-if="game.sellablePatternIds.length" />
    <PatternLegend v-else />

    <div class="rivals">
      <h2 class="rivals-title">Rivals</h2>
      <PlayerPresence />
    </div>

    <ProposedCell />
  </div>
</template>

<style scoped>
.GamePage {
}

.header {
  display: flex;
  height: 80px;
  position: relative;
  margin-bottom: 1.5rem;
  --distance: 0;
}

.room-tile {
  display: flex;
  flex: 1 0 0;
  margin-left: -8rem;
}

.back {
  cursor: pointer;
  flex: 0 0 2.25rem;
  width: 2.25rem;
  height: 2.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  border-radius: 99999px;
  background-color: rgba(0, 0, 0, 0.1);
  color: var(--black);
}

.room {
  padding: 12px;
  padding-left: 8rem;
  display: flex;
  align-items: center;
}

.room-details {
  margin-right: 0.5rem;
}

.room-title {
  display: block;
  margin: 0;
  line-height: 1;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 0.07em;
  font-weight: 700;
  margin-bottom: 2px;
  opacity: 0.5;
  min-height: 0;
}

.score {
  flex: 1 0 0;
  margin-right: -8rem;
}

.room-id {
  display: block;
  margin: 0;
  font-size: 24px;
  text-transform: uppercase;
  font-weight: 700;
  line-height: 1;
}

.board-container {
  padding: 1rem;
}

.rivals {
  padding: 1rem;
}
</style>
