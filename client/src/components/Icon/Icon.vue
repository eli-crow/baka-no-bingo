<script setup lang="ts">
import { IconDefinition } from '.';

const props = defineProps<{
  icon: IconDefinition;
}>();
</script>

<template>
  <svg
    :width="props.icon.w"
    :height="props.icon.h"
    :viewBox="`0 0 ${props.icon.w} ${props.icon.h}`"
  >
    <title>{{ props.icon.title }}</title>
    <path fill="currentcolor" :d="props.icon.d" />
  </svg>
</template>

<style scoped>
svg {
  display: inline-block;
  height: 1em;
  width: auto;
  overflow: visible;
}
</style>
