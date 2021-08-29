<script setup>
import { computed, reactive, watch } from 'vue';

import ModalAction from '../components/ModalAction.vue';
import ModalTransition from '../components/ModalTransition.vue';
import Tile from '../components/Tile.vue'
import Icon, {star as starIcon, ba, ka, no, bi, ng, o} from '../components/Icon';

import appInfo from '../data/appInfo.json';
import specialThanks from '../data/specialThanks.json';
import game from "../store/game";
import router from '../routes'

const state = reactive({
  modal: '',
  roomCode: '',
});

const specialThanksList = computed(() => {
  return new Intl.ListFormat('en-US', { style: 'long', type: 'conjunction' }).format(specialThanks);
});

function cancelHost() {
  state.modal = '';
  game.cancelHost();
}

watch(() => game.room.id, value => {
  if (value) router.push('/game');
});
</script>




<template>
  <div class="HomePage">
    <div class="width">
      <h1 class="title">
        Baka no Bingo
        <span class="and-other-games">And Other Games</span>
      </h1>

      <div class="tile-group-container">
        <div class="tile-group-aspect-ratio">
          <div class="tile-group">
            <Tile color="blue" :icon="ba" />
            <Tile color="blue" :icon="ka" />
            <Tile color="white" :icon="no" />
            <Tile
              tag="button"
              color="blue-light"
              @click="game.host()"
            >
              Host
            </Tile>
            <Tile color="red" :icon="starIcon" />
            <Tile
              tag="button"
              color="yellow-light"
              @click="state.modal = 'joining'"
            >
              Join
            </Tile>
            <Tile color="yellow" :icon="bi" />
            <Tile color="yellow" :icon="ng" />
            <Tile color="yellow" :icon="o" />
          </div>
        </div>
      </div>

      <div class="credits">
        <p class="byline">
          A game by Eli Crow
        </p>
        <p class="special-thanks">
          Special thanks to: {{ specialThanksList }}.
        </p>
      </div>

      <ModalTransition>
        <ModalAction
          v-if="state.modal === 'joining'"
          title="Join a Game"
          description="Enter the code given by your host."
          @close="state.modal = ''"
        >
          <input
            v-model="state.roomCode"
            type="text"
          >
          <button
            class="button"
            @click="game.join(state.roomCode)"
          >
            Join Room
          </button>
        </ModalAction>
      </ModalTransition>
    </div>
  </div>
</template>



<style scoped>
.HomePage {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
}

.width {
  min-width: 0;
  width: 100%;
  max-width: 40rem;
}

.title {
  font: var(--font-title);
  font-size: 5.5rem;
  letter-spacing: -0.05em;
  line-height: 0.9;
  margin-bottom: 2.5rem;
  margin-left: -0.045em;
  font-weight: 900;
}
.and-other-games {
  display: inline-block;
  max-width: 8rem;
  min-width: 0;
  font-size: 1.375rem;
  line-height: 1.25;
  opacity: 0.3;
  letter-spacing: normal;
}

.tile-group-container {
  --border-scale: 1.1;
  --tile-padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: calc(var(--border-scale) * 14.88px);
}
.tile-group-aspect-ratio {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  max-width: 25rem;
}
.tile-group-aspect-ratio::before {
  content: "";
  width: 0;
  height: 0;
  padding-bottom: 100%;
}
.tile-group {
  position: relative;
  width: 100%;
  padding-bottom: var(--border-scale) * 14.88px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
}

.character {
  font-weight: 700;
  font-size: 5rem;
}
button.tile {
    position: relative;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: black;
  text-decoration: none;
}
button.tile::after {
   position: absolute;
  content: "";
  left: 50%;
  top: 50%;
  width: 4rem;
  height: 4rem;
  transform: translate(-50%, -50%);
  background-color: var(--circle);
  border-radius: 99999px;
  pointer-events: none;
  /* HACK: you can do better than this */
  mix-blend-mode: darken;
}

.byline {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.special-thanks {
  margin-top: 0;
}

.button {
  display: flex;
  width: max-content;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  padding: 12px 16px;
  border-radius: var(--radius-small);
  box-shadow: 0 6px 0 0 var(--green-dark);
  background-color: var(--green);
  font-weight: 700;
  color: white;
  text-decoration: inherit;
}
</style>
