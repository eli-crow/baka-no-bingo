<script setup lang="ts">
import { AVATAR_NAMES, AvatarName } from '@shared';
import Avatar from './Avatar.vue';
import TileButton from './TileButton.vue';

const props = defineProps<{
  modelValue?: AvatarName;
}>();

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();
</script>

<template>
  <div class="grid">
    <TileButton
      v-for="avatar in AVATAR_NAMES"
      :key="avatar"
      class="avatar"
      :color="props.modelValue === avatar ? 'red' : 'white'"
      @click="emit('update:modelValue', avatar)"
    >
      <Avatar class="avatar-image" draggable="false" :avatar="avatar" />
    </TileButton>
  </div>
</template>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7rem, 1fr));
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
