<template>
	<transition-group class="BingoBoard3"
				tag="div"
				name="cell">
		<div :class="{cell: true, '-selected': cell.selected}"
		     v-for="(cell, i) in virtualCells"
		     :key="'cell' + i"
		     @click="toggleCell(cell, i)">
			<span v-if="i === 4" class="icon">★</span>
			<span v-else class="text">{{ cell.text }}</span>
		</div>
	</transition-group>
</template>



<script>
export default {
	name: 'BingoBoard3',
	computed: {
		virtualCells () {
			const result = this.cells.slice()
			result[4].selected = true
			return result
		},
		isWinner () {
			const c = this.virtualCells.map(({selected}) => selected)
			return c[0] && c[1] && c[2]
			    || c[0] && c[4] && c[8]
			    || c[0] && c[3] && c[6]
			    || c[1] && c[4] && c[7]
			    || c[2] && c[5] && c[8]
			    || c[3] && c[4] && c[5]
			    || c[6] && c[7] && c[8]
			    || c[2] && c[4] && c[6]
		}
	},
	props: {
		cells: Array,
		enabled: {
			type: Boolean,
			default: true,
		},
	},
	watch: {
		isWinner (newValue) {
			if (newValue) {
				this.$emit('win')
			}
		}
	},
	methods: {
		toggleCell(cell, i) {
			if (!this.enabled || i === 4) return
			cell.selected = !cell.selected
		}
	},
}
</script>



<style scoped>
.BingoBoard3 {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: repeat(3, 33.33333vw);
	overflow: hidden;
	border-top: var(--line-groove);
	border-bottom: var(--line-groove);
}

.cell {
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 8px;
	border: solid 1px var(--color-theme-gray-light);
	font-size: 3.25vw;
}
.cell.-selected {
	background-color: var(--color-theme-red);
	border: solid 1px var(--color-theme-red-dark);
}
.cell:nth-child(5) {
	background-color: var(--color-theme-red);
}

.cell-move {
	transition: 0.25s ease;
	transition-property: opacity, transform;
}

.icon {
	font-size: 20vw;
}
</style>
