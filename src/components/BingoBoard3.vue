<template>
	<TransitionList class="BingoBoard3">
		<div class="cell-container"
		      v-for="(cell, i) in cells"
		      :key="cell.key"
			  :style="{zIndex: i}">
			<div :class="{
				     cell: true,
				     '-selected': cell.selected,
				     '-star': i === 4,
				  }"
				  @click="$emit('select', i)">
				<span v-if="i === 4" class="icon">★</span>
				<span v-else class="text">{{ cell.text }}</span>
			</div>
		</div>
	</TransitionList>
</template>



<script>
import TransitionList from '@/components/TransitionList'

export default {
	name: 'BingoBoard3',
	components: {
		TransitionList,
	},
	props: {
		cells: Array,
		enabled: {
			type: Boolean,
			default: true,
		},
	},
}
</script>



<style scoped>
.BingoBoard3 {
	position: relative;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: repeat(3, 33.33333vw);
	padding-bottom: 0.5rem;
	z-index: 1;
}

.cell-container {
}

.cell {
	height: 100%;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 8px;
	font-size: 3.75vw;
	box-shadow: 0 0.5rem 0 0 var(--dark, var(--gray-lightest));
	border-radius: 16px;
	background-color: var(--light, white);
	border: solid 2px var(--dark, var(--gray-lightest));
	border-top: solid 2px var(--lighter, white);
}
.cell::before {
	position: absolute;
	content: '';
	left: 0;
	top: 0;
	width: 100%;
	height: calc(100% + 0.5rem);
	border: solid 2px var(--light);
	opacity: 0.4;
	border-radius: inherit;
	mix-blend-mode: screen;
}
.cell.-selected {
	--light: var(--red);
	--lighter: var(--red-light);
	--dark: var(--red-dark);
	color: white;
}
.cell.-star {
	background-color: var(--red);
	color: inherit;
}

.icon {
	font-size: 20vw;
}
</style>
