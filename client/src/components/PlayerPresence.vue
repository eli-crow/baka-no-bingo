<script setup lang="ts">
import { useClientGameState } from '@/composables/createClientGameState';
import Avatar from './Avatar.vue';
import BingoBoard3Preview from './BingoBoard3Preview.vue';
import Tile from './Tile.vue';

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const game = useClientGameState();
</script>

<template>
  <TransitionGroup tag="ol" class="list" name="springy">
    <li
      class="item"
      v-for="player in game.playersRankedByScore"
      :key="player.id"
    >
      <Tile
        :color="player.id === game.myPlayerId ? 'blue-light' : 'white'"
        @click="emit('select', player.id)"
      >
        <div class="player-tile">
          <Avatar class="avatar" :avatar="player.avatar" />

          <div v-if="player.id === game.myPlayerId" class="corner me">Me</div>
          <BingoBoard3Preview v-else class="corner" :board="player.board" />

          <span class="score">
            {{ player.score }}
          </span>
        </div>
      </Tile>

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
  padding: 0 1rem;
  overflow-x: auto;
}

.item {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.player-tile {
  padding: 0.5rem 0.5rem 1.25rem;
  height: 8rem;
  width: 100%;
  position: relative;
}

.name {
  text-align: center;
}

.avatar {
  height: calc(100% - 1rem);
  width: 100%;
  top: 0;
  left: 0;
  object-fit: contain;
  object-position: center;
}

.corner {
  position: absolute;
  bottom: 0.25rem;
  right: 0.25rem;
}

.me {
  background-color: var(--blue);
  color: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: 99999px;
}

.score {
  position: absolute;
  bottom: 0.6rem;
  left: 0.25rem;
  font-weight: 600;
}
</style>
