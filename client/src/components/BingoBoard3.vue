<script setup>
import { computed, nextTick, reactive } from 'vue';
import { star as starIcon } from './Icon'
import Tile from './Tile.vue'

const props = defineProps({
  tiles: {
    type: Array,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits([
  'select'
]);

const state = reactive({
  animate: false,
  tileMeasurements: new WeakMap(),
  staggerIndex: 0
});

function setTileRef(tile) {
  if (tile) {
    const el = tile.$el
    state.tileMeasurements.set(el, measureTile(el))
  }
}

function beforeLeave(el) {
  const measurements = state.tileMeasurements.get(el)
  Object.assign(el.style, measurements, {
    zIndex: Number(el.style.zIndex) + 1,
  })
  el.style.setProperty('--stagger-index', state.staggerIndex)
  state.staggerIndex++
}
function leave(el) {
  state.tileMeasurements.delete(el)
  nextTick(() => {
    state.staggerIndex--
  })
}

function measureTile(el) {
  const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
  const { offsetLeft, offsetTop } = el;
  const left = `${offsetLeft - parseFloat(marginLeft, 10)}px`;
  const top = `${offsetTop - parseFloat(marginTop, 10)}px`;
  return {left, top, width, height}
}

function clearTileMeasurements() {
  state.tileMeasurements.clear()
}
</script>



<template>
  <div class="tile-group-container">
    <div class="tile-group-aspect-ratio">
      <transition-group
        :class="{'tile-group':true, '-animate': state.animate}"
        name="tile-group"
        tag="div"
        @before-leave="beforeLeave"
        @leave="leave"
      >
        <Tile 
          v-for="(tile, i) in props.tiles"
          :ref="setTileRef"
          :key="tile.key"
          tag="button"
          :disabled="i === 4"
          :color="tile.selected ? 'red' : 'white'"
          :animate="i !== 4 && state.animate && tile.selected"
          :icon="i === 4 ? starIcon : null"
          :style="{zIndex: i}"
          @select="emit('select', i); state.animate = true;"
        >
          {{ i === 4 ? '' : tile.text }}
        </Tile>
      </transition-group>
    </div>
  </div>
</template>



<style scoped>
.tile-group-container {
  --border-scale: 1;
  --tile-padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: calc(var(--border-scale) * 14.88px);
}
.tile-group-aspect-ratio {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
  max-width: 25rem;
}
.tile-group-aspect-ratio::before {
  content: "";
  width: 0;
  height: 0;
  padding-bottom: 100%;
}

.tile-group {
  position: relative;
  width: 100%;
  padding-bottom: var(--border-scale) * 14.88px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  border-color: black;
}

.tile-group-enter-active,
.tile-group-enter-to,
.tile-group-leave-active {
  --stagger-delay: calc(var(--stagger-index, 0) * 30ms);
  --duration-transform: 0.35s;
  --duration-delay: 0.2s;
  --duration-opacity: 0.25s;
  --easing-transform: cubic-bezier(0.74, 0.01, 0.455, 1.29);
  transform-origin: center;
  pointer-events: none;
}
.tile-group-enter-active,
.tile-group-enter-to {
  transition: 
    opacity var(--duration-opacity) ease var(--stagger-delay),
    transform var(--duration-transform) var(--easing-transform)
      calc(
        var(--duration-opacity) + var(--duration-delay) + var(--stagger-delay)
      );
}
.tile-group-leave-active {
  transition: 
    opacity var(--duration-opacity) ease
      calc(
        var(--duration-transform) + var(--duration-delay) + var(--stagger-delay)
      ),
    transform var(--duration-transform) var(--easing-transform) var(--stagger-delay);
}

.tile-group-leave-from,
.tile-group-leave-active {
  position: absolute !important;
}

.tile-group-enter-from {
  opacity: 0;
  --distance: 0;
}
.tile-group-leave-to {
  opacity: 0;
  --distance: 16rem;
}

.tile-group-move:not(.tile-group-leave-active):not(.tile-group-enter-active) {
  transition: transform 0.35s ease;
  z-index: 1;
}
</style>