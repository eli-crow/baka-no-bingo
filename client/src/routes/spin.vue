<script setup lang="ts">
import Tile from '@/components/Tile.vue';
import TileButton from '@/components/TileButton.vue';
import { createAnimeRouletteState } from '@/composables/createAnimeRouletteState';

const roulette = createAnimeRouletteState();
</script>

<template>
  <div class="page">
    <h1 class="title">Random Anime</h1>

    <Tile color="blue">
      <div class="content">
        <header class="tile-header">
          <h2>You will watch...</h2>
          <TileButton
            @click="roulette.start"
            :disabled="!roulette.canSpin"
            color="yellow"
            >{{ roulette.spinActionText }}</TileButton
          >
        </header>

        <template v-if="roulette.status.type === 'idle'">
          <p>Press the button below to find a random anime to watch.</p>
          <p v-if="roulette.status.errorMessage">{{
            roulette.status.errorMessage
          }}</p>
        </template>

        <template v-else-if="roulette.status.type === 'fetching'">
          <p>Fetching anime...</p>
        </template>

        <template v-else-if="roulette.series">
          <div class="shown">
            <div class="thumbnail-container">
              <Transition name="springy">
                <div
                  class="thumbnail"
                  :key="roulette.status.candidateIndex"
                  :style="{
                    pointerEvents:
                      roulette.status.type === 'spinning' ? 'none' : 'auto',
                  }"
                  role="presentation"
                >
                  <p class="thumbnail-title">
                    {{ roulette.series.title }}
                  </p>
                  <!-- <img class="thumbnail-image" :src="roulette.thumbnailSrc" /> -->
                </div>
              </Transition>
            </div>

            <div class="anime-details">
              <h2 class="anime-title">{{ roulette.series.title }}</h2>
              <p class="anime-description">{{ roulette.series.description }}</p>
              <ul class="anime-tags">
                <li
                  class="anime-tag"
                  v-for="tag in roulette.series.tags"
                  :key="tag"
                >
                  {{ tag }}
                </li>
              </ul>

              <h3 class="source-title">Sources</h3>
              <ul class="source-group">
                <li class="source" v-for="source in roulette.series.sources">
                  <a :href="source.url" class="source-link" target="_blank">
                    {{ source.provider }}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </template>
      </div>
    </Tile>
  </div>
</template>

<style scoped>
.page {
  --ambient: var(--blue);
  --ambient-dark: var(--blue-dark);
  background-color: var(--ambient);
  color: var(--white);
  padding: 1rem;
}

.content {
  display: grid;
  padding: 1rem;
}

.tile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.shown {
  display: grid;
  gap: 1rem;
}

@media (min-width: 30rem) {
  .shown {
    grid-template-columns: auto 2fr;
  }
}

.anime-details {
  display: flex;
  flex-direction: column;
  text-align: left;
}

.anime-title {
  font: var(--font-title);
  margin-bottom: 0.75rem;
}

.anime-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
  list-style-type: none;
  padding: 0;
}

.anime-tag {
  background-color: var(--blue-dark);
  border-radius: 0.5rem;
  padding: 0.25rem 0.5rem;
}

.thumbnail-container {
  position: relative;
  height: 13rem;
  width: 10rem;
}

.thumbnail {
  width: 100%;
  height: 100%;
  display: flex;
  background: white;
  color: black;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.source-title {
  font: var(--font-title);
  margin-bottom: 0.5rem;
}
.source-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style-type: none;
  padding: 0;
}
.source-link {
  color: var(--whtie);
}
</style>
