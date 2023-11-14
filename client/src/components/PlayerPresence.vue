<script setup lang="ts">
import { useClientGameState } from '@/composables/createClientGameState';
import Avatar from './Avatar.vue';
import BingoBoard3Preview from './BingoBoard3Preview.vue';

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const game = useClientGameState();
</script>

<template>
  <ol class="player-group">
    <li
      v-for="player in game.playersRankedByScore"
      :key="player.id"
      class="player"
      @click="emit('select', player.id)"
    >
      <Avatar class="avatar" :avatar="player.avatar" />

      <div v-if="player.id === game.myPlayerId" class="corner me">Me</div>
      <BingoBoard3Preview v-else class="corner" :board="player.board" />
    </li>
  </ol>
</template>

<style scoped>
.player-group {
  list-style-type: none;
  padding: 0;
  display: flex;
  padding: 0 1rem;
}

.player {
  position: relative;
}

.avatar {
  height: 5rem;
  width: 5rem;
}

.corner {
  position: absolute;
  bottom: 0;
  right: 0;
}

.me {
  background-color: var(--red);
  color: var(--white);
  padding: 0.25rem 0.5rem;
  border-radius: 99999px;
  box-shadow: 0.25rem 0.25rem 0 var(--ambient-dark);
  border: solid 1.5px var(--black);
}
</style>
