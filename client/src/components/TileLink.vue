<script setup lang="ts">
import Tile, { TileProps } from './Tile.vue';

type TileLinkProps = Omit<TileProps, 'tag' | 'action'> & {
  disabled?: boolean;
  href: string;
};

const props = withDefaults(defineProps<TileLinkProps>(), {
  color: 'white',
  animate: false,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'select', event: MouseEvent): void;
}>();

const slots = defineSlots<{
  default?(): any;
}>();

function handleClick(e: MouseEvent) {
  if (props.disabled) {
    e.preventDefault();
    return;
  }

  emit('select', e);
}
</script>

<template>
  <Tile
    class="TileLink"
    tag="a"
    action
    :href="props.href"
    :aria-disabled="props.disabled"
    :icon="props.icon"
    :color="props.color"
    :animate="props.animate"
    @click="handleClick"
  >
    <slot />
  </Tile>
</template>

<style scoped>
.TileLink {
}
</style>
