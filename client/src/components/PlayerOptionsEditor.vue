<script setup lang="ts">
import { PlayerOptions } from '@shared';
import { defineProps } from 'vue';
import AvatarSelector from './AvatarSelector.vue';
import TextInput from './TextInput.vue';
import Tile from './Tile.vue';

const props = defineProps<{ modelValue: PlayerOptions }>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: PlayerOptions): void;
}>();
</script>

<template>
  <Tile color="blue">
    <div class="player-info">
      <AvatarSelector
        class="avatar-selector"
        v-model="props.modelValue.avatar"
      />
      <div class="player-inputs">
        <p class="name-label">Name</p>
        <TextInput
          class="name-input"
          :value.lazy.trim="props.modelValue.name"
          @input="emit('update:modelValue', $event)"
          type="text"
          :placeholder="props.modelValue.avatar ?? 'Name'"
        />
      </div>
    </div>
  </Tile>
</template>

<style scoped>
.player-info {
  padding: 0.5rem 1rem 1rem;
}

.avatar-label {
  font-weight: 700;
  font-size: large;
  margin-bottom: 1rem;
  text-align: left;
}

.player-inputs {
  display: flex;
  position: relative;
  z-index: 4;
  gap: 1rem;
}

.name-label {
  font-weight: 700;
  font-size: large;
  align-self: center;
}

.name-input {
  flex: 1 0 0;
}

.avatar-selector {
  margin: 1rem 0 1.5rem;
}
</style>
