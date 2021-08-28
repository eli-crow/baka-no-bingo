<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  icon: Object
});

export * as icons from './icons.js'
</script>

<template>
  <svg :width="icon.w" :height="icon.h" :view-box="`0 0 ${icon.w} ${icon.h}`">
    <path :d="icon.d" fill="currentcolor" />
  </svg>
</template>

<style scoped>
svg {
  display: inline-block;
  height: 1em;
}
</style>
