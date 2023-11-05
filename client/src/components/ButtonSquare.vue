<script setup lang="ts">
import Icon, { IconDefinition } from './Icon';

const props = withDefaults(
  defineProps<{
    color: string;
    icon?: IconDefinition;
    cost?: string | number;
    href?: string;
  }>(),
  {
    color: 'green',
  }
);

const emit = defineEmits(['select']);
</script>

<template>
  <a
    class="ButtonSquare Button"
    :href="href"
    :style="{
      '--bg': `var(--${color})`,
      '--bg-dark': `var(--${color}-dark)`,
      '--fg': `var(--white)`,
    }"
    @click="emit('select')"
  >
    <Icon v-if="icon" class="icon" :icon="icon" />
    <span class="slot-content"><slot /></span>
    <span v-if="cost === 0 || cost" class="cost">-{{ cost }}</span>
  </a>
</template>

<style scoped>
.ButtonSquare {
  width: max-content;
  max-width: 100%;
  display: flex;
  padding: 12px 16px;
  border-radius: var(--radius-small);
  background: var(--bg);
  box-shadow: 0 6px 0 0 var(--bg-dark);
  color: var(--fg);
  font-size: 16px;
  font-weight: 700;
}
.icon {
  color: var(--fg);
  font-size: 20px;
  margin-right: 12px;
}
.slot-content {
}
.cost {
  margin-left: 12px;
  color: black;
}
</style>
