<script setup>
import { reactive } from 'vue';

import Tile from '../components/Tile.vue'
import Icon, {chevronLeft, listOl} from '../components/Icon'
import BingoBoard3 from '../components/BingoBoard3.vue';
import PatternIcon from '../components/PatternIcon.vue';
import PatternSellBar from '../components/PatternSellBar.vue';
import PatternLegend from '../components/PatternLegend.vue';
import ActionButton from '../components/ActionButton.vue';
import TheBuyMenu from '../components/TheBuyMenu.vue';
import ModalTransition from '../components/ModalTransition.vue';
import ModalPlayerRank from '../components/ModalPlayerRank.vue';

import game from '../store/game';

const props = defineProps({
  resetGameOnLoad: Boolean,
});

const state = reactive({
  modal: ''
});

function handleTileSelect(i) {
  if (i === 4) return;

  if (game.boughtTile) game.placeTile(i);
  else game.toggleTile(i);
}
</script>



<template>
  <div class="GamePage">
    <header class="header">
      <Tile color="yellow" class="room-tile">
        <div class="room">
          <router-link class="back" to="/">
            <Icon :icon="chevronLeft" />
          </router-link>
          <p class="room-details">
            <span class="room-title">Room</span>
            <span class="room-id">{{ game.room.id }}</span>
          </p>
        </div>
      </Tile>
      <Tile class="score-tile" color="white">  
        <div class="scores">
          <div class="my-score">{{ game.playerData.score }}</div>
          <a class="players" @click="state.modal = 'ModalPlayerRank'">
            <Icon :icon="listOl" />
          </a>
        </div>
      </Tile>
    </header>

    <div class="board-container">
      <BingoBoard3
        class="board"
        :tiles="game.playerData.tiles"
        @select="handleTileSelect"
      />
    </div>

    <PatternSellBar v-if="game.sellablePatterns.length" />
    <PatternLegend v-else-if="!game.boughtTile" />

    <transition name="action-group">
      <TheBuyMenu v-if="game.boughtTile" />
      <div v-else class="action-group">
        <ActionButton
          class="action"
          icon="spell-replace"
          label="Replace"
          color="green"
          cost="5"
          :enabled="game.playerData.score >= 5"
          @select="game.spells.buy()"
        />

        <ActionButton
          class="action"
          icon="spell-reset"
          label="Reset"
          color="red"
          cost="10"
          :enabled="game.playerData.score >= 10"
          @select="game.spells.reset()"
        />
      </div>
    </transition>

    <ModalTransition>
      <component
        :is="state.modal"
        v-if="state.modal"
        @close="state.modal = null"
      />
    </ModalTransition>
  </div>
</template>



<style scoped>
.GamePage {
}

.header {
  display: flex;
  height: 80px;
  position: relative;
  margin-bottom: 1rem;
  --distance: 0;
}
.room-tile {
  flex: 1 1 0;
  display: flex;
  margin-left: -8rem;
}
.back {
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
}
.score-tile {
  flex: 1 1 auto;
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
  text-align: center;
  display: flex;
  align-items: center;
  font: var(--font-title);
  font-size: 2rem;
  line-height: 1;
}
.my-score {
  padding: 8px 12px 8px 20px;
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
