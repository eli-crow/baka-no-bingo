<template>
	<TransitionList class="BingoBoard3">
		<div :class="{
		         cell: true,
			   '-selected': cell.selected,
			   '-star': i === 4,
		     }"
		     v-for="(cell, i) in cells"
		     :key="cell.id"
		     :style="{zIndex: i}"
		     @click="$emit('select', i)">
			<span v-if="i === 4" class="icon">★</span>
			<span v-else class="text">{{ cell.text }}</span>
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
	box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.2);
	z-index: 1;
	border-radius: var(--radius-medium);
}

.cell {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 8px;
	border: solid 1px var(--color-theme-gray-lightest);
	font-size: 3.75vw;
	background-color: white;
	box-shadow: 0 0.5rem 0 0 var(--color-theme-gray-lightest);
}
.cell.-selected {
	background-color: var(--color-theme-red);
	border: solid 1px var(--color-theme-red-dark);
	box-shadow: 0 0.5rem 0 0 var(--color-theme-red-dark);
	color: white;
}
.cell.-star {
	background-color: var(--color-theme-red);
	color: inherit;
}
/*rounded-corners*/
.cell:nth-child(1) {
	border-top-left-radius: inherit;
}
.cell:nth-child(3) {
	border-top-right-radius: inherit;
}
.cell:nth-child(7) {
	border-bottom-left-radius: inherit;
}
.cell:nth-child(9) {
	border-bottom-right-radius: inherit;
}

.icon {
	font-size: 20vw;
}
</style>
