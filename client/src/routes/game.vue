<script setup lang="ts">
import ActionButton from '@/components/ActionButton.vue';
import ActivatedCell from '@/components/ActivatedCell.vue';
import BingoBoard3 from '@/components/BingoBoard3.vue';
import Icon, { chevronLeft, listOl } from '@/components/Icon';
import ModalPlayerRank from '@/components/ModalPlayerRank.vue';
import ModalTransition from '@/components/ModalTransition.vue';
import PatternLegend from '@/components/PatternLegend.vue';
import PatternSellBar from '@/components/PatternSellBar.vue';
import PlayerPresence from '@/components/PlayerPresence.vue';
import Tile from '@/components/Tile.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import router from '@/routes';
import { ref } from 'vue';

const game = useClientGameState();

const playerRankShown = ref(false);

function leave() {
  game.leave();
  router.push('/');
}
</script>

<template>
  <div class="GamePage">
    <header class="header">
      <Tile color="yellow" class="room-tile">
        <div class="room">
          <button class="back" @click="leave">
            <Icon :icon="chevronLeft" />
          </button>
          <p class="room-details">
            <span class="room-title">Room</span>
            <span class="room-id">{{ game.code }}</span>
          </p>
          <PlayerPresence />
        </div>
      </Tile>

      <Tile class="score-tile">
        <div class="scores">
          <div class="my-score">{{ game.player?.score }}</div>
          <a class="players" @click="playerRankShown = !playerRankShown">
            <Icon :icon="listOl" />
          </a>
        </div>
      </Tile>
    </header>

    <div class="board-container">
      <BingoBoard3
        class="board"
        :cells="game.cells"
        @select="i => game.toggleCell(i)"
      />
    </div>

    <PatternSellBar v-if="game.sellablePatternIds.length" />
    <PatternLegend v-else />

    <!-- <TheBuyMenu v-if="game.boughtTile" /> -->
    <div class="action-group">
      <ActionButton
        class="action"
        iconSrc="spell-replace"
        label="Replace"
        color="green"
        cost="5"
        :enabled="game.canReplace"
      />
      <!-- @select="game.spells.buy()" -->

      <ActionButton
        class="action"
        iconSrc="spell-reset"
        label="Reset"
        color="red"
        cost="10"
        :enabled="game.canReset"
      />
      <!-- @select="game.spells.reset()" -->
    </div>

    <ModalTransition>
      <ModalPlayerRank
        v-if="playerRankShown"
        @close="playerRankShown = false"
      />
    </ModalTransition>

    <ActivatedCell />
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
  min-height: 0;
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
.score-tile {
  flex: 0 1 auto;
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
.scores {
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
.my-score {
  padding-right: 0.75rem;
  border-right: solid 1px var(--gray-light);
}
.players {
  padding: 8px 16px 8px 12px;
  font-size: 24px;
}

.board-container {
  padding: 1rem;
}

.action-group {
  padding-top: 1rem;
  display: flex;
  justify-content: space-around;
}
.action {
  flex: 0 1 auto;
}
.action-group-enter-active,
.action-group-leave-active {
  transition: 250ms ease;
  transition-property: opacity, transform;
}
.action-group-leave-active {
  position: absolute;
  width: 100%;
}
.action-group-enter,
.action-group-leave-to {
  opacity: 0;
  transform: translateY(1rem);
}

.button-group {
  display: flex;
}
.button {
  height: 33.33333vw;
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  --color: green;
  color: var(--color);
  font: var(--font-title);
  font-size: 1rem;
}
.button.-red {
  --color: var(--red);
}
.button.-blue {
  --color: var(--blue);
}
.button.-green {
  --color: var(--green);
}
.button-icon {
  width: 2.5rem;
  height: 2.5rem;
  padding: 0.7rem;
  margin-bottom: 0.5rem;
  background-color: var(--color);
  border-radius: 99999px;
  color: white;
}

.info-button {
  border: solid 1px var(--gray-light);
  padding: 0.25rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 2px;
  color: var(--gray-light);
  mix-blend-mode: multiply;
}
</style>
