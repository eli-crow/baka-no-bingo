<script setup lang="ts">
import { useGameStateMachine } from '@/composables/createGameStateMachine';
import { PlayerData } from '@shared';
import { computed } from 'vue';
import BingoBoard3Preview from './BingoBoard3Preview.vue';

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const game = useGameStateMachine();

const playersRanked = computed(() => {
  if ('room' in game.state) {
    return Object.values(game.state.room.players).sort(
      (a, b) => b!.score - a!.score
    ) as PlayerData[];
  }
  return [];
});
</script>

<template>
  <div class="PlayerList" v-if="'room' in game.state">
    <ol class="list">
      <li
        v-for="player in playersRanked"
        :key="player.id"
        class="player"
        @click="emit('select', player.id)"
      >
        <BingoBoard3Preview class="icon" :board="player.board" />
        <div class="name">
          {{ player.name || 'Guest' }}
        </div>
        <div class="score">
          {{ player.score }}
        </div>
      </li>
    </ol>
  </div>
</template>

<style scoped>
.list {
  padding: 0;
  margin: 0;
  list-style-type: none;
}
.player {
  display: flex;
  align-items: center;
  border-radius: var(--radius-small);
  padding: 4px 8px;
  background-color: var(--white);
  border: solid 1px var(--gray-light);
  box-shadow: 0 4px 0 0 var(--gray-light);
}
.icon {
  flex: 0 0 auto;
  margin-right: 12px;
}
.name {
  flex: 1 1 0px;
}
.score {
  flex: 0 1 auto;
  font-size: 24px;
  font-weight: 700;
}
</style>
