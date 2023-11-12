<script setup lang="ts">
import { ROOM_CODE_PATTERN } from '@shared';
import { defineEmits, defineProps } from 'vue';
import TextInput from './TextInput.vue';
import Tile from './Tile.vue';

const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<(e: 'update:modelValue', value: string) => void>();
</script>

<template>
  <Tile color="blue">
    <div class="content">
      <h2 class="title">Game Code</h2>
      <TextInput
        class="input"
        :value="props.modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        :pattern="ROOM_CODE_PATTERN"
        maxlength="4"
        required
      />
    </div>
  </Tile>
</template>

<style scoped>
.content {
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.title {
  font-weight: 700;
  font-size: large;
  flex: 1 0 0;
  text-align: left;
}

.input {
  width: 6rem;
}
</style>
