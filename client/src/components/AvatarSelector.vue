<script setup lang="ts">
import cal from '@/assets/avatars/cal.svg';
import cat from '@/assets/avatars/cat.svg';
import ein from '@/assets/avatars/ein.svg';
import nina from '@/assets/avatars/nina.svg';
import { AvatarName } from '@shared';
import Tile from './Tile.vue';

const props = defineProps<{
  modelValue?: AvatarName;
}>();

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();
</script>

<template>
  <Tile class="AvatarSelector">
    <Tile
      class="avatar"
      :color="props.modelValue === 'cal' ? 'red' : 'white'"
      @click="emit('update:modelValue', 'cal')"
    >
      <img class="avatar-image" :src="cal" />
    </Tile>
    <Tile
      class="avatar"
      :color="props.modelValue === 'cat' ? 'red' : 'white'"
      @click="emit('update:modelValue', 'cat')"
    >
      <img class="avatar-image" :src="cat" />
    </Tile>
    <Tile
      class="avatar"
      :color="props.modelValue === 'ein' ? 'red' : 'white'"
      @click="emit('update:modelValue', 'ein')"
    >
      <img class="avatar-image" :src="ein" />
    </Tile>
    <Tile
      class="avatar"
      :color="props.modelValue === 'nina' ? 'red' : 'white'"
      @click="emit('update:modelValue', 'nina')"
    >
      <img class="avatar-image" :src="nina" />
    </Tile>
    <Tile
      class="avatar"
      :color="props.modelValue === 'cal' ? 'red' : 'white'"
      @click="emit('update:modelValue', 'cal')"
    >
      <img class="avatar-image" :src="cal" />
    </Tile>
    <Tile
      class="avatar"
      :color="props.modelValue === 'cat' ? 'red' : 'white'"
      @click="emit('update:modelValue', 'cat')"
    >
      <img class="avatar-image" :src="cat" />
    </Tile>
    <Tile
      class="avatar"
      :color="props.modelValue === 'ein' ? 'red' : 'white'"
      @click="emit('update:modelValue', 'ein')"
    >
      <img class="avatar-image" :src="ein" />
    </Tile>
    <Tile
      class="avatar"
      :color="props.modelValue === 'nina' ? 'red' : 'white'"
      @click="emit('update:modelValue', 'nina')"
    >
      <img class="avatar-image" :src="nina" />
    </Tile>
  </Tile>
</template>

<style scoped>
.AvatarSelector {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 1rem;
}

.avatar {
  padding: 1rem;
}

.avatar[data-selected] {
}

.avatar-image {
  height: 5rem;
  width: 5rem;
  grid-area: content;
  align-self: center;
  justify-self: center;
}
</style>
