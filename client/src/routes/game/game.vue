<script lang="ts" setup>
import BingoBoard3 from '@/components/BingoBoard3.vue';
import Icon, { chevronLeft } from '@/components/Icon';
import ModalTransition from '@/components/ModalTransition.vue';
import PatternLegend from '@/components/PatternLegend.vue';
import PatternSellBar from '@/components/PatternSellBar.vue';
import PlayerPresence from '@/components/PlayerPresence.vue';
import ProposedCell from '@/components/ProposedCell.vue';
import Tile from '@/components/Tile.vue';
import TileButton from '@/components/TileButton.vue';
import TileLink from '@/components/TileLink.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import router from '@/routes';

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
        <div class="header-content">
          <div class="room">
            <button class="back" @click="leave">
              <Icon :icon="chevronLeft" />
            </button>
            <p class="room-details">
              <span class="room-title">Room</span>
              <span class="room-id">{{ game.code }}</span>
            </p>
          </div>
          <TileLink href="/game/spin" color="yellow">Spin</TileLink>
          <TileButton color="blue">Link</TileButton>
        </div>
      </Tile>
    </header>

    <div class="board-container">
      <BingoBoard3 :cells="game.cells" @select="i => game.toggleCell(i)" />
    </div>

    <PatternSellBar v-if="game.sellablePatternIds.length" />
    <PatternLegend v-else />

    <div class="rivals">
      <PlayerPresence />
    </div>

    <ProposedCell />

    <Teleport to="body">
      <ModalTransition>
        <RouterView />
      </ModalTransition>
    </Teleport>
  </div>
</template>

<style scoped>
.GamePage {
}

.header {
  --distance: 0;
  display: flex;
  position: relative;
  margin-block-end: 1.5rem;
}

.header-content {
  display: flex;
  flex: 1 0 0;
  padding: 1rem;
  gap: 0.5rem;
}

.room-tile {
  display: flex;
  flex: 1 0 0;
  margin-inline: 1rem;
  margin-block-start: 1rem;
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
  flex: 1 0 0;
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
  padding-block-start: 0;
}

.rivals {
  padding: 1rem;
}
</style>
