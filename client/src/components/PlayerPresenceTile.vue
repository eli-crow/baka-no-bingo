<script setup lang="ts">
import createPatternBubbleState from '@/composables/createPatternBubbleState';
import { Player } from '@shared';
import Avatar from './Avatar.vue';
import BingoBoard3Preview from './BingoBoard3Preview.vue';
import Tile from './Tile.vue';

const props = defineProps<{
  isMe: boolean;
  player: Player;
}>();

const emit = defineEmits<{
  (e: 'select', id: string): void;
}>();

const bubble = createPatternBubbleState(props.player.id);
</script>

<template>
  <Tile
    class="PlayerPresenceTile"
    :color="props.isMe ? 'blue-light' : 'white'"
    @click="emit('select', player.id)"
  >
    <div class="content">
      <Avatar class="avatar" :avatar="player.avatar" />

      <div v-if="props.isMe" class="corner me">Me</div>
      <BingoBoard3Preview v-else class="corner" :board="player.board" />

      <span class="score">
        {{ player.score }}
      </span>

      <Transition name="springy">
        <img
          v-if="bubble.data"
          class="bubble"
          :src="bubble.data.src"
          :key="bubble.data.key"
          role="presentation"
        />
      </Transition>
    </div>
  </Tile>
</template>

<style scoped>
.PlayerPresenceTile {
  position: relative;
}

.content {
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

.bubble {
  position: absolute;
  top: 0rem;
  left: -2rem;
  width: 10rem;
  z-index: 1;
}
</style>
