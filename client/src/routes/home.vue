<script setup lang="ts">
import { computed } from 'vue';

import { ba, bi, circle, ka, ng, no, o, star } from '@/components/Icon';
import Tile from '@/components/Tile.vue';
import TileLink from '@/components/TileLink.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import specialThanks from '@/data/specialThanks.json';

const game = useClientGameState();

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
      <h1 class="title">Baka no Bingo</h1>

      <div class="tile-group-container">
        <div class="tile-group-aspect-ratio">
          <div class="tile-group">
            <Tile color="blue" :icon="ba" />
            <Tile color="blue" :icon="ka" />
            <Tile color="white" :icon="no" />

            <TileLink
              href="/host"
              color="blue-light"
              class="button"
              :disabled="!game.canHost"
              :icon="circle"
            >
              Host
            </TileLink>
            <Tile color="red" :icon="star" />
            <TileLink
              href="/join"
              color="yellow-light"
              class="button"
              :disabled="!game.canJoin"
              :icon="circle"
            >
              Join
            </TileLink>

            <Tile color="yellow" :icon="bi" />
            <Tile color="yellow" :icon="ng" />
            <Tile color="yellow" :icon="o" />
          </div>
        </div>
      </div>

      <div class="credits">
        <p class="byline">A game by Eli Crow</p>
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
  font-size: 5rem;
  letter-spacing: -0.05em;
  line-height: 0.9;
  margin-bottom: 2rem;
  margin-left: -0.045em;
  font-weight: 900;
}

.tile-group-container {
  --border-scale: 1.1;
  --tile-padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: calc(var(--border-scale) * 14.88px + 1rem);
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

:global(.button *) {
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: black;
}

.credits {
  position: relative;
  z-index: 1;
}

.byline {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.special-thanks {
  margin-top: 0;
}
</style>
