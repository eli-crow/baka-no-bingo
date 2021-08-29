<script setup>
import PatternChips from './PatternChips.vue';
import game from '../store/game'

const emit = defineEmits(['select'])
</script>



<template>
  <div class="PlayerList">
    <ol class="list">
      <li
        v-for="player in game.room.playersRanked"
        :key="player.id"
        class="player"
        @click="emit('select', player.id)"
      >
        <PatternChips
          class="icon"
          :tiles="player.tiles"
        />
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
