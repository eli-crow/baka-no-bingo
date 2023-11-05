<script setup lang="ts">
import cal from '@/assets/avatars/cal.svg';
import cat from '@/assets/avatars/cat.svg';
import ein from '@/assets/avatars/ein.svg';
import nina from '@/assets/avatars/nina.svg';
import { AvatarName } from '@shared';
import Tile from './Tile.vue';

const AVATARS = [
  { name: 'cal', image: cal },
  { name: 'cat', image: cat },
  { name: 'ein', image: ein },
  { name: 'nina', image: nina },
];

const props = defineProps<{
  modelValue?: AvatarName;
}>();

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();
</script>

<template>
  <div class="grid">
    <Tile
      v-for="avatar in AVATARS"
      :key="avatar.name"
      class="avatar"
      :color="props.modelValue === avatar.name ? 'red' : 'white'"
      @select="emit('update:modelValue', avatar.name)"
    >
      <img class="avatar-image" draggable="false" :src="avatar.image" />
    </Tile>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 1rem;
}

.avatar {
}

.avatar-image {
  height: 5rem;
  width: 5rem;
  grid-area: content;
  align-self: center;
  justify-self: center;
}
</style>
