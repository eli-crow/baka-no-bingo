<script setup lang="ts">
import { useClientGameState } from '@/composables/createClientGameState';
import Avatar from './Avatar.vue';

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
      <Avatar class="icon" :avatar="player.avatar" />
    </li>
  </ol>
</template>

<style scoped>
.player-group {
  list-style-type: none;
  padding: 0;
  display: flex;
}

.player {
  display: contents;
}

.icon {
  flex: 0 0 auto;
  height: 2.5rem;
  width: 2.5rem;
}
.player:not(:last-child) > .icon {
  margin-right: -1rem;
}
</style>
