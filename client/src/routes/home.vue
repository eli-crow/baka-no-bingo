<script setup lang="ts">
import { computed } from 'vue';

import { ba, bi, ka, ng, no, o, star as starIcon } from '@/components/Icon';
import Tile from '@/components/Tile.vue';

import specialThanks from '@/data/specialThanks.json';

const specialThanksList = computed(() => {
  return new Intl.ListFormat('en-US', {
    style: 'long',
    type: 'conjunction',
  }).format(specialThanks);
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
            <Tile tag="a" href="/host" color="blue-light">Host</Tile>
            <Tile color="red" :icon="starIcon" />
            <Tile tag="a" href="/join" color="yellow-light">Join</Tile>
            <Tile color="yellow" :icon="bi" />
            <Tile color="yellow" :icon="ng" />
            <Tile color="yellow" :icon="o" />
          </div>
        </div>
      </div>

      <div class="credits">
        <p class="byline"> A game by Eli Crow </p>
        <p class="special-thanks">
          Special thanks to: {{ specialThanksList }}.
        </p>
      </div>
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
  content: '';
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
  content: '';
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
../composables/game
