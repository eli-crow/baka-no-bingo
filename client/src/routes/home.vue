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
    <header class="header">
      <img
        class="logo"
        src="@/assets/images/logo.svg"
        alt="Baka no Bingo: Bingo for the reluctant Otaku"
      />
    </header>

    <div class="tile-group-container">
      <div class="tile-group-aspect-ratio">
        <div class="tile-group">
          <Tile color="blue" :icon="ba" />
          <Tile color="blue" :icon="ka" />
          <Tile color="white" :icon="no" />

          <TileLink
            href="/host"
            color="blue-light"
            class="button-tile"
            :disabled="!game.canHost"
            :icon="circle"
          >
            Host
          </TileLink>
          <Tile color="red" :icon="star" />
          <TileLink
            href="/join"
            color="yellow-light"
            class="button-tile"
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
</template>

<style scoped>
.HomePage {
  display: grid;
  align-self: center;
  grid-template:
    'header' auto
    '.' 0.5rem
    'tiles' auto
    '.' 1rem
    'credits' 1fr
    / 1fr;
  padding: 1.5rem;
  min-width: 0;
  width: 100%;
  max-width: 40rem;
}

@media (min-width: 60rem) {
  .HomePage {
    align-content: center;
    padding: 2rem;
    max-width: 68rem;
    grid-template:
      'header tiles' auto
      '. tiles' 2rem
      'credits tiles' auto
      / 1fr 1fr;
  }
}

.header {
  grid-area: header;
}

.logo {
  --overhang: 1.5rem;
  width: calc(100% + var(--overhang) * 2);
  margin-inline: calc(var(--overhang) * -1);
}

.tile-group-container {
  grid-area: tiles;
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

.credits {
  grid-area: credits;
}

.byline {
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.button-tile {
  text-transform: uppercase;
  font-weight: 700;
  letter-spacing: 0.09em;
}

.special-thanks {
  margin-top: 0;
}
</style>
