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
  <TransitionGroup tag="ol" class="list" name="player">
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
  display: flex;
  padding: 0 1rem;
}

.item {
  position: relative;
  width: 7rem;
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

.player-enter-active {
  animation: pop-in 0.5s var(--spring-easing);
}
.player-leave-active {
  transition: opacity 0.5s var(--spring-easing);
}
.player-enter {
  transform: scale(0);
}
.player-leave-to {
  opacity: 0;
}
.player-move {
  transition: transform 0.5s var(--spring-easing);
}

@keyframes pop-in {
  0% {
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
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
