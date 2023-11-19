<script lang="ts" setup>
import Icon, { listOl } from '@/components/Icon';
import ModalPlayerRank from '@/components/ModalPlayerRank.vue';
import ModalTransition from '@/components/ModalTransition.vue';
import Tile from '@/components/Tile.vue';
import { useClientGameState } from '@/composables/createClientGameState';
import { ref } from 'vue';

const game = useClientGameState();

const playerRankShown = ref(false);
</script>

<template>
  <Tile class="ScoreTile">
    <div class="content">
      <div class="score">{{ game.player?.score }}</div>
      <button class="rank-button" @click="playerRankShown = !playerRankShown">
        <Icon :icon="listOl" />
      </button>
    </div>

    <Teleport to="body">
      <ModalTransition>
        <ModalPlayerRank
          v-if="playerRankShown"
          @close="playerRankShown = false"
        />
      </ModalTransition>
    </Teleport>
  </Tile>
</template>

<style scoped>
.content {
  text-align: right;
  display: flex;
  align-items: center;
  font: var(--font-title);
  font-size: 1.5rem;
  line-height: 1;
  justify-content: flex-end;
  padding-right: 8rem;
  padding-left: 0.5rem;
}

.score {
  padding-right: 0.75rem;
  border-right: solid 1px var(--gray-light);
}

.rank-button {
  padding: 8px 16px 8px 12px;
  font-size: 24px;
}
</style>
