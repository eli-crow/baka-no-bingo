<script setup>
import ModalAction from '../components/ModalAction.vue';
import ModalTransition from '../components/ModalTransition.vue';

import { computed, reactive, watch } from 'vue';

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
    <div class="title-container">
      <div class="title">
        Baka no Bingo ★ <span class="title-version">v{{ appInfo.version }}</span>
      </div>
      <div class="title title-duplicate">
        Baka no Bingo ★ <span class="title-version">v{{ appInfo.version }}</span>
      </div>
    </div>

    <div class="tile-group-container">
      <div class="tile-group-aspect-ratio">
        <div class="tile-group">
          <div class="tile -blue">ば</div>
          <div class="tile -blue">か</div>
          <div class="tile -small -white">の</div>
          <button
            class="tile -text -blue-light -button"
            @click="game.host()"
          >
            Host
          </button>
          <div class="tile -star -red">★</div>
          <button
            class="tile -text -yellow-light -button"
            @click="state.modal = 'joining'"
          >
            Join
          </button>
          <div class="tile -yellow">ビ</div>
          <div class="tile -yellow">ン</div>
          <div class="tile -yellow">ゴ</div>
        </div>
      </div>
    </div>

    <pre><code>{{ JSON.stringify(game.room, null, "\t") }}</code></pre>

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
</template>



<style scoped>
.HomePage {
  background: var(--yellow);
}

.title-container {
  height: 68px;
  display: flex;
  padding-left: 4rem;
  padding-top: 2rem;
  align-items: center;
}

@keyframes title {
  0% {
    transform: none;
  }
  100% {
    transform: translateX(-100%);
  }
}
.title {
  white-space: nowrap;
  font: var(--font-title);
  font-size: 8rem;
  letter-spacing: -0.03em;
  padding-right: 2rem;
  will-change: transform;
  animation-name: title;
  animation-duration: 6s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
}

.title-version {
  position: absolute;
  color: white;
  top: 53%;
  right: 4.5rem;
  font-size: 1.25rem;
  letter-spacing: 0;
  transform: translate(-50%, -50%);
}

.tile-group-container {
  --border-scale: 0.95;
  --tile-padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1rem calc(var(--border-scale) * 14.88px) 1rem;
}
.tile-group-aspect-ratio {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  max-width: 25rem;
  box-sizing: content-box;
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
.tile {
  /* 
	set min-width and -height to override default tile sizing behavior
	allowing consistently sized tiles.
	*/
  min-width: 0;
  min-height: 0;
  position: relative;
  border-image-slice: 36% 36% 50% 36% fill;
  border-image-width: calc(var(--border-scale) * 36px)
    calc(var(--border-scale) * 36px) calc(var(--border-scale) * 50px)
    calc(var(--border-scale) * 36px);
  border-image-repeat: stretch;
  border-image-outset: 0px 0px calc(var(--border-scale) * 14.88px) 0px;
  border-style: solid;
  padding: var(--tile-padding);
  /* margin-bottom: calc(var(--border-scale) * -14.88px); */
  /* padding-bottom: calc(var(--border-scale) * 14.88px + var(--tile-padding)); */
  display: flex;
  cursor: default;
  user-select: none;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-weight: 700;
  font-size: 5rem;
  transition: 0.35s ease;
  transition-property: transform;
}
.tile.-small {
  font-size: 2rem;
}
.tile.-button {
  cursor: pointer;
}
.tile.-button:hover {
  outline: 0;
  transform: translateY(-0.4rem);
}
.tile.-button:active {
  transition-duration: 0.25s;
  transform: translateY(0.3rem);
}
.tile.-text {
  position: relative;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: black;
  text-decoration: none;
}
.tile.-text::after {
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
.tile.-blue {
  --circle: var(--blue);
  border-image-source: url("../assets/images/tile-blue.svg");
}
.tile.-red {
  --circle: var(--red);
  border-image-source: url("../assets/images/tile-red.svg");
}
.tile.-yellow {
  --circle: var(--yellow);
  border-image-source: url("../assets/images/tile-yellow.svg");
}
.tile.-white {
  --circle: var(--white);
  border-image-source: url("../assets/images/tile-white.svg");
}
.tile.-blue-light {
  --circle: var(--blue);
  border-image-source: url("../assets/images/tile-light-blue.svg");
}
.tile.-yellow-light {
  --circle: var(--yellow);
  border-image-source: url("../assets/images/tile-light-yellow.svg");
}

.credits {
  padding: 0 1rem;
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
