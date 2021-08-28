<script setup>
import { defineProps, computed } from 'vue';

const PATHS = {
  "01235678": "M 0,0  L 0,1  L 1,1  L 1,0  Z",
  "012": "M 0,0  L 1,0",
  "345": "M 0,0.5  L 1,0.5",
  "678": "M 0,1  L 1,1",
  "036": "M 0,0  L 0,1",
  "147": "M 0.5,0  L 0.5,1",
  "258": "M 1,0  L 1,1",
  "048": "M 0,0  L 1,1",
  "246": "M 0,1  L 1,0",
};

const props = defineProps({
  pattern: {
    type: String,
    required: true
  }
});

const bottomLines = computed(() => [PATHS['01235678'], PATHS['345'], PATHS['147'], PATHS['048'], PATHS['246']]);
const topLines = computed(() => {
  switch (props.pattern) {
    case '012345678': return [PATHS['01235678'], PATHS['345'], PATHS['147'], PATHS['048'], PATHS['246']];
    case '02468': return [PATHS['048'], PATHS['246']];
    case '13457': return [PATHS['345'], PATHS['147']];
    default: return [PATHS[props.pattern]] || [];
  }
});
</script>



<template>
  <svg
    class="PatternIcon"
    width="1px"
    height="1px"
    viewBox="0 0 1 1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g class="grid">
      <path
        v-for="(path, i) in bottomLines"
        :key="i"
        :d="path"
        class="line"
      />
    </g>
    <path
      v-for="(path, i) in topLines"
      :key="'active'+i"
      :d="path"
      class="line-active"
    />
  </svg>
</template>



<style scoped>
.PatternIcon {
	--grid-color: var(--black);
	--active-color: var(--color-text-dark);
	overflow: visible;
	display: inline-block;
	width: 1.33333rem;
	height: 1.33333rem;
}

.line {
	fill: none;
	stroke-width: 2px;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke: var(--grid-color);
	vector-effect: non-scaling-stroke;
}

.grid {
	opacity: 0.08;
}

.line-active {
	fill: none;
	stroke-width: 3.5px;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke: var(--active-color);
	vector-effect: non-scaling-stroke;
}
</style>
