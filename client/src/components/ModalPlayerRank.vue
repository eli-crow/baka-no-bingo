<script setup lang="ts">
import ModalAction from './ModalAction.vue';
import PlayerList from './PlayerList.vue';

const emit = defineEmits(['close']);
</script>

<template>
  <ModalAction
    class="ModalPlayerRank"
    title="Players"
    description="Who's in the lead?"
    @close="emit('close')"
  >
    <PlayerList class="player-list" />
  </ModalAction>
</template>
