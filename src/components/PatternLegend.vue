<template>
	<div class="PatternLegend">
		<div class="pattern">
			<PatternIcon class="pattern-icon" pattern="246"/>
			<PatternIcon class="pattern-icon" pattern="345"/>
			<div class="pattern-score">20</div>
		</div>
		<div class="pattern">
			<PatternIcon class="pattern-icon" pattern="036"/>
			<PatternIcon class="pattern-icon" pattern="012"/>
			<div class="pattern-score">50</div>
		</div>
		<div class="pattern">
			<PatternIcon class="pattern-icon" pattern="13457"/>
			<PatternIcon class="pattern-icon" pattern="02468"/>
			<div class="pattern-score">100</div>
		</div>
		<div class="pattern">
			<PatternIcon class="pattern-icon" pattern="012345678"/>
			<div class="pattern-score">250</div>
		</div>
	</div>
</template>



<script>
import PatternIcon from '@/components/PatternIcon'

export default {
	name: 'PatternLegend',
	components: {
		PatternIcon,
	},
}
</script>



<style scoped>
.PatternLegend {
	display: flex;
	background-color: var(--blue-gray-light);
	height: 3.5rem;
	justify-content: space-between;
	padding: 0 1rem;
}

.pattern {
	display: flex;
	align-items: center;
}

.pattern-icon + .pattern-icon {
	margin-left: 0.5rem;
}

.pattern-score {
	padding-left: 0.5rem;
	font-weight: 700;
	color: var(--color-text-light);
}
</style>
