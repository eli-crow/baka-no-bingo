<script setup lang="ts">
import { useBoardState } from '@/composables/createBoardState';
import { useGameStateMachine } from '@/composables/createGameStateMachine';
import { computed } from 'vue';
import PatternChips from './PatternChips.vue';

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const game = useGameStateMachine();
const board = useBoardState();

const playersRanked = computed(() => {
  if ('room' in game.state) {
    return Object.values(game.state.room.players).sort(
      (a, b) => b!.score - a!.score
    );
  }
  return [];
});
</script>

<template>
  <div class="PlayerList" v-if="'room' in game.state">
    <ol class="list">
      <li
        v-for="player in playersRanked"
        :key="game.state.player.id"
        class="player"
        @click="emit('select', game.state.player.id)"
      >
        <PatternChips class="icon" :cells="board.cells" />
        <div class="name">
          {{ game.state.player.name || 'Guest' }}
        </div>
        <div class="score">
          {{ game.state.player.score }}
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
../composables/game
