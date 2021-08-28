<script setup>
import { defineProps, reactive, ref } from 'vue';

const props = defineProps({
  tiles: Array,
  enabled: {
    type: Boolean,
    default: true,
  },
});

const state = reactive({
  staggerIndex: 0,
  animate: false,
});

const transitionGroupRef = ref();


function beforeLeave(el) {
  el.style.setProperty('--stagger-index', this.staggerIndex);

  el.style.zIndex = Number(el.style.zIndex) + 1;

  const { styleLeft, styleTop, styleWidth, styleHeight } = el.dataset;
  el.style.left = styleLeft;
  el.style.top = styleTop;
  el.style.width = styleWidth;
  el.style.height = styleHeight;

  state.staggerIndex++;
}

function measureTileOffsets() {
  const children = Array.from(transitionGroup.current.$el.children);
  children.forEach(el => {
    const { marginLeft, marginTop, width, height } = window.getComputedStyle(el);
    const { offsetLeft, offsetTop } = el;
    el.dataset.styleLeft = `${offsetLeft - parseFloat(marginLeft, 10)}px`;
    el.dataset.styleTop = `${offsetTop - parseFloat(marginTop, 10)}px`;
    el.dataset.styleWidth = width;
    el.dataset.styleHeight = height;
  });
  state.staggerIndex = 0;
}

//TODO: updated and mounted
function updated() {
  measureTileOffsets();
}

function mounted() {
  measureTileOffsets();
}
</script>



<template>
  <div class="tile-group-container">
    <div class="tile-group-aspect-ratio">
      <transition-group :class="{'tile-group':true, '-animate': animate}"
        name="tile-group"
        tag="div"
        ref="transitionGroup"
        @before-leave="beforeLeave">
        <div :class="{
						tile: true,
						'-red': tile.type === 'trope' && tile.selected,
						'-selected-animate': i !== 4 && animate && tile.selected,
						'-white': tile.type === 'trope' && !tile.selected,
						'-star': i === 4,
					}"
          v-for="(tile, i) in tiles"
          :key="tile.key"
          :style="{
						zIndex: i
					}"
          @click="$emit('select', i); animate = true;">
          <span v-if="i === 4" class="icon">★</span>
          <span v-else class="text">{{ tile.text }}</span>
        </div>
      </transition-group>
    </div>
  </div>
</template>



<style scoped>
.BingoBoard3 {
}

.tile-group-container {
  --border-scale: 0.85;
  --tile-padding: 8px;
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
  box-sizing: content-box;
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
.tile {
  /* 
	set min-width and -height to override default tile sizing behavior
	allowing consistently sized tiles.
	*/
  min-width: 0;
  min-height: 0;
  position: relative;
  border-image-source: url("../assets/images/tile-white.svg");
  border-image-slice: 36% 36% 50% 36% fill;
  border-image-width: calc(var(--border-scale) * 36px)
    calc(var(--border-scale) * 36px) calc(var(--border-scale) * 50px)
    calc(var(--border-scale) * 36px);
  border-image-repeat: stretch;
  border-image-outset: 0px 0px calc(var(--border-scale) * 14.88px) 0px;
  border-style: solid;
  padding: var(--tile-padding);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 14px;
  line-height: 1.15;
  touch-action: manipulation;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}
.tile.-text {
  position: relative;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-weight: 700;
  color: black;
  text-decoration: none;
}
.tile.-text::after {
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
  /* HACK: you can do better than this */
  mix-blend-mode: darken;
}
.tile.-blue {
  --circle: var(--blue);
  border-image-source: url("../assets/images/tile-blue.svg");
}
.tile.-red {
  --circle: var(--red);
  color: white;
  border-image-source: url("../assets/images/tile-red.svg");
}
.tile.-purple {
  --circle: var(--purple);
  color: white;
  border-image-source: url("../assets/images/tile-purple.svg");
}
.tile.-skull .icon {
  color: var(--black);
  opacity: 0.3;
}
@keyframes tile-selected-animate {
  50% {
    transform: translate3d(0, 0.5rem, 0);
  }
}
.tile.-selected-animate {
  animation: tile-selected-animate 0.5s ease;
}
.tile.-star .icon {
  color: var(--black);
}
.tile.-yellow {
  --circle: var(--yellow);
  border-image-source: url("../assets/images/tile-yellow.svg");
}
.tile.-white {
  --circle: var(--white);
  border-image-source: url("../assets/images/tile-white.svg");
}
.tile.-blue-light {
  --circle: var(--blue);
  border-image-source: url("../assets/images/tile-light-blue.svg");
}
.tile.-yellow-light {
  --circle: var(--yellow);
  border-image-source: url("../assets/images/tile-light-yellow.svg");
}

.icon {
  display: block;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 4rem;
}

.text {
  position: relative;
  zindex: 1;
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
}
.tile-group-enter-active,
.tile-group-enter-to {
  transition: opacity var(--duration-opacity) ease var(--stagger-delay),
    transform var(--duration-transform) var(--easing-transform)
      calc(
        var(--duration-opacity) + var(--duration-delay) + var(--stagger-delay)
      );
}
.tile-group-leave-active {
  transition: opacity var(--duration-opacity) ease
      calc(
        var(--duration-transform) + var(--duration-delay) + var(--stagger-delay)
      ),
    transform var(--duration-transform) var(--easing-transform)
      var(--stagger-delay);
}

.tile-group-leave,
.tile-group-leave-active {
  position: absolute !important;
}

.tile-group-enter {
  opacity: 0;
  transform: translateY(1rem);
}
.tile-group-leave-to {
  opacity: 0;
  transform: translateY(-8rem);
}

.tile-group-move:not(.tile-group-leave-active):not(.tile-group-enter-active) {
  transition: transform 0.35s ease;
  z-index: 1;
}
</style>