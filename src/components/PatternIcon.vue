<template>
	<svg class="PatternIcon"
	     width="1px"
	     height="1px"
	     viewBox="0 0 1 1"
	     xmlns="http://www.w3.org/2000/svg" >
		<path v-for="(path, i) in bottomLines"
		      :d="path"
			:key="i"
			class="line"/>
		<path v-for="(path, i) in topLines"
		      :d="path"
			:key="'active'+i"
			class="line-active"/>
	</svg>
</template>



<script>
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
}

export default {
	name: 'PatternIcon',
	computed: {
		topLines () {
			switch (this.pattern) {
				case '012345678': return [PATHS['01235678'], PATHS['345'], PATHS['147'], PATHS['048'], PATHS['246']]
				case '02468':     return [PATHS['048'], PATHS['246']]
				case '13457':     return [PATHS['345'], PATHS['147']]
				default:          return [PATHS[this.pattern]] || []
			}
		},
		bottomLines () {
			return [PATHS['012345678'], PATHS['345'], PATHS['147'], PATHS['048'], PATHS['246']]
		},
	},
	props: {
		pattern: String,
	},
}
</script>



<style scoped>
.PatternIcon {
	--grid-color: rgb(201, 201, 201);
	--active-color: var(--color-text-dark);
	overflow: visible;
	display: inline-block;
	width: 1.75rem;
	height: 1.75rem;
}

.line {
	fill: none;
	stroke-width: 2px;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke: var(--grid-color);
	vector-effect: non-scaling-stroke;
}

.line-active {
	fill: none;
	stroke-width: 3px;
	stroke-linecap: round;
	stroke-linejoin: round;
	stroke: var(--active-color);
	vector-effect: non-scaling-stroke;
}
</style>
