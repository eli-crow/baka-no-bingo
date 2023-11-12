<script setup lang="ts">
import Tile, { TileProps } from './Tile.vue';

type TileButtonProps = Omit<TileProps, 'tag' | 'action'> & {
  disabled?: boolean;
};

const props = withDefaults(defineProps<TileButtonProps>(), {
  color: 'white',
  animate: false,
  disabled: false,
});

const slots = defineSlots<{
  default?(): any;
}>();
</script>

<template>
  <Tile
    class="TileButton"
    tag="button"
    action
    type="button"
    :disabled="props.disabled"
    :icon="props.icon"
    :color="props.color"
    :animate="props.animate"
  >
    <div class="content">
      <slot />
    </div>
  </Tile>
</template>

<style scoped>
.TileButton {
  font-weight: 700;
}

.content {
  padding: 0.35rem 0.5rem 0;
}
</style>
