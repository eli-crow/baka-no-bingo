<script setup lang="ts">
import { AVATAR_NAMES, AvatarName } from '@shared';
import Avatar from './Avatar.vue';
import Tile from './Tile.vue';

const props = defineProps<{
  modelValue?: AvatarName;
}>();

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();
</script>

<template>
  <div class="grid">
    <Tile
      v-for="avatar in AVATAR_NAMES"
      :key="avatar"
      class="avatar"
      :color="props.modelValue === avatar ? 'red' : 'white'"
      @select="emit('update:modelValue', avatar)"
    >
      <Avatar class="avatar-image" draggable="false" :avatar="avatar" />
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
