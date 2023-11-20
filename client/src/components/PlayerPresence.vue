<script setup lang="ts">
import { useClientGameState } from '@/composables/createClientGameState';
import PlayerPresenceTile from './PlayerPresenceTile.vue';

const game = useClientGameState();
</script>

<template>
  <TransitionGroup tag="ol" class="list" name="springy">
    <li
      class="item"
      v-for="player in game.playersRankedByScore"
      :key="player.id"
    >
      <PlayerPresenceTile
        :player="player"
        :isMe="player.id === game.player?.id"
      />

      <span class="name">
        {{ player.name }}
      </span>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.list {
  list-style-type: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(6rem, 1fr));
  grid-template-rows: 1fr;
  grid-auto-flow: column;
  overflow-x: auto;
  padding-top: 4px;
}

.item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.name {
  text-align: center;
}
</style>
