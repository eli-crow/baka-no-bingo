<script setup lang="ts">
import Icon, { IconDefinition } from './Icon';

export type TileColor =
  | 'white'
  | 'yellow'
  | 'blue-light'
  | 'yellow-light'
  | 'blue'
  | 'red'
  | 'purple';

export type TileProps = {
  icon?: IconDefinition;
  color?: TileColor;
  animate?: boolean;
  tag?: string;
};

const props = withDefaults(defineProps<TileProps>(), {
  color: 'white',
  animate: false,
  tag: 'div',
});

const slots = defineSlots<{
  default?(): {};
}>();
</script>

<template>
  <component :is="tag" class="tile" draggable="false">
    <div class="shadow" />
    <div
      class="tile-inner"
      :data-animate="props.animate"
      :data-color="props.color"
    >
      <Icon v-if="props.icon" class="icon" :icon="props.icon" />
      <div v-if="slots.default" class="content">
        <slot />
      </div>
    </div>
  </component>
</template>

<style scoped>
.tile {
  --tile-padding-inner: var(--tile-padding, 4px 6px 6px);
  --border-scale-inner: var(--border-scale, 0.95);
  --distance: 0.25rem;
  position: relative;
  z-index: 1;
  display: flex;
  text-decoration: none;
  padding: 0;
  user-select: none;
  min-width: 0;
}

.tile * {
  user-select: none;
}

.tile:is(button:not(:disabled), a) {
  cursor: pointer;
}

.tile:is(button:not(:disabled), a):hover {
  --distance: 1rem;
}

.tile:is(button:not(:disabled), a):active {
  --distance: 0rem;
}

.tile-inner {
  flex: 1 0 0;
  height: 100%;
  border-image-source: url('@/assets/images/tile-white.svg');
  border-image-slice: 36% 36% 50% 36% fill;
  border-image-width: calc(var(--border-scale-inner) * 36px)
    calc(var(--border-scale-inner) * 36px)
    calc(var(--border-scale-inner) * 50px)
    calc(var(--border-scale-inner) * 36px);
  border-image-repeat: stretch;
  border-image-outset: 0px 0px calc(var(--border-scale-inner) * 14.88px) 0px;
  border-style: solid;
  padding: var(--tile-padding-inner);
  display: flex;
  text-align: center;
  align-items: center;
  font-size: 14px;
  line-height: 1.15;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  transform: translateY(calc(var(--distance) * -1));
  transition: 0.35s ease;
  transition-property: transform;
  min-width: 0;
}

.shadow {
  content: '';
  display: block;
  background: var(--ambient-dark);
  border-radius: calc(var(--border-scale-inner) * 36px);
  left: 0;
  top: 0;
  width: 100%;
  height: calc(100% + var(--tile-padding-inner) * 2);
  --d: calc(var(--distance) + 0.5rem);
  transform: translate(var(--d), var(--d));
  position: absolute;
  z-index: -1000000;
  transition: 0.35s ease;
  transition-property: transform;
  pointer-events: none;
}

.tile-inner[data-color='yellow'] {
  --circle: var(--yellow);
  --ambient: var(--yellow);
  --ambient-dark: var(--yellow-dark);
  --icon-color: var(--black);
  --text-color: var(--black);
  border-image-source: url('@/assets/images/tile-yellow.svg');
}

.tile-inner[data-color='white'] {
  --circle: var(--white);
  --ambient: var(--white);
  --ambient-dark: var(--gray-light);
  --icon-color: var(--black);
  --text-color: var(--black);
  border-image-source: url('@/assets/images/tile-white.svg');
}

.tile-inner[data-color='blue-light'] {
  --circle: var(--blue);
  --ambient: var(--blue-light);
  --ambient-dark: var(--blue);
  --icon-color: var(--blue);
  border-image-source: url('@/assets/images/tile-light-blue.svg');
}

.tile-inner[data-color='yellow-light'] {
  --circle: var(--yellow);
  --ambient: var(--yellow-light);
  --ambient-dark: var(--yellow);
  --icon-color: var(--yellow);
  border-image-source: url('@/assets/images/tile-light-yellow.svg');
}

.tile-inner[data-color='blue'] {
  --circle: var(--blue);
  --ambient: var(--blue);
  --ambient-dark: var(--blue-dark);
  --icon-color: var(--white);
  --text-color: var(--white);
  border-image-source: url('@/assets/images/tile-blue.svg');
}

.tile-inner[data-color='red'] {
  --circle: var(--red);
  --ambient: var(--red);
  --ambient-dark: var(--red-dark);
  --icon-color: var(--black);
  --text-color: var(--white);
  border-image-source: url('@/assets/images/tile-red.svg');
}

.tile-inner[data-color='purple'] {
  --circle: var(--purple);
  --ambient: var(--purple);
  --ambient-dark: var(--purple-dark);
  --icon-color: var(--black);
  --text-color: var(--white);
  border-image-source: url('@/assets/images/tile-purple.svg');
}

.icon {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4.5rem;
  color: var(--icon-color, var(--black));
}

.content {
  position: relative;
  flex: 1 0 0;
  z-index: 1;
  color: var(--text-color, var(--black));
}

.content :global(*) {
  color: var(--text-color, var(--black));
}
</style>
