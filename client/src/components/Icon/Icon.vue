<script setup>
const props = defineProps({
  icon: {
    type: Object,
    required: true,
  },
});
</script>

<template>
  <svg
    :width="props.icon.w"
    :height="props.icon.h"
    :view-box="`0 0 ${props.icon.w} ${props.icon.h}`"
  >
    <path
      :d="props.icon.d"
      fill="currentcolor"
    />
  </svg>
</template>

<style scoped>
svg {
  display: inline-block;
  height: 1em;
}
</style>
