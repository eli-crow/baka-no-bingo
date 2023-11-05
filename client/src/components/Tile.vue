<script setup lang="ts">
import Icon, { IconDefinition } from './Icon';

type TileColor =
  | 'white'
  | 'yellow'
  | 'blue-light'
  | 'yellow-light'
  | 'blue'
  | 'red'
  | 'purple';

const props = withDefaults(
  defineProps<{
    icon?: IconDefinition;
    color?: TileColor;
    animate?: boolean;
    tag?: string;
  }>(),
  {
    color: 'white',
    animate: false,
    tag: 'div',
  }
);

const emit = defineEmits<{
  (e: 'select'): void;
}>();
</script>

<template>
  <component :is="tag" class="tile" @click="emit('select')">
    <div class="shadow" />
    <div
      class="tile-inner"
      :data-animate="props.animate"
      :data-color="props.color"
    >
      <Icon v-if="props.icon" class="icon" :icon="props.icon" />
      <span v-if="$slots.default" class="content">
        <slot />
      </span>
    </div>
  </component>
</template>

<style scoped>
.tile {
  --tile-padding-inner: var(--tile-padding, 6px);
  --border-scale-inner: var(--border-scale, 0.95);
  --distance: 0.25rem;
  position: relative;
  z-index: 1;
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
  min-width: 0;
  min-height: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
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
}

.shadow {
  content: '';
  display: block;
  background: #f3961c;
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

/* .tile-inner.-text {
  position: relative;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: black;
  text-decoration: none;
}
.tile-inner.-text::after {
  position: absolute;
  content: "";
  left: 50%;
  top: 50%;
  width: 4rem;
  height: 4rem;
  transform: translate(-50%, -50%);
  background-color: var(--circle);
  border-radius: 99999px;
  pointer-events: none;
  mix-blend-mode: darken;
} */

.tile-inner[data-color='yellow'] {
  --circle: var(--yellow);
  border-image-source: url('@/assets/images/tile-yellow.svg');
}

.tile-inner[data-color='white'] {
  --circle: var(--white);
  border-image-source: url('@/assets/images/tile-white.svg');
}

.tile-inner[data-color='blue-light'] {
  --circle: var(--blue);
  border-image-source: url('@/assets/images/tile-light-blue.svg');
}

.tile-inner[data-color='yellow-light'] {
  --circle: var(--yellow);
  border-image-source: url('@/assets/images/tile-light-yellow.svg');
}

.tile-inner[data-color='blue'] {
  --circle: var(--blue);
  border-image-source: url('@/assets/images/tile-blue.svg');
}

.tile-inner[data-color='red'] {
  --circle: var(--red);
  color: white;
  border-image-source: url('@/assets/images/tile-red.svg');
}

.tile-inner[data-color='red'] .icon {
  color: black;
}

.tile-inner[data-color='purple'] {
  --circle: var(--purple);
  color: white;
  border-image-source: url('@/assets/images/tile-purple.svg');
}

.icon {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4.5rem;
}

.content {
  position: relative;
  flex: 1 0 0;
  z-index: 1;
}
</style>
