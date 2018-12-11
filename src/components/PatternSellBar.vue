<template>
	<div class="PatternSellBar">
		<div class="title">売る Sell!</div>
		<div class="pattern-group">
			<div class="pattern"
			     v-for="(p, i) in patterns"
			     :key="i"
			     @click="$emit('sell', p)">
				<PatternIcon class="pattern-icon"
				             :pattern="p.pattern.join('')"/>
				<span class="pattern-score">+{{ p.score }}</span>
			</div>
		</div>
	</div>
</template>



<script>
import PatternIcon from '@/components/PatternIcon'

export default {
	name: 'PatternSellBar',
	components: {
		PatternIcon,
	},
	props: {
		patterns: Array,
	},
}
</script>



<style scoped>
.PatternSellBar {
	background: var(--color-theme-blue);
	display: flex;
	align-items: center;
	font: var(--font-title);
	padding-left: 1rem;
	height: 3.5rem;
}

.title {
	color: white;
	white-space: nowrap;
	flex: 0 0 auto;
	margin-right: 1rem;
}

.pattern-group {
	display: flex;
	overflow-x: hidden;
	flex: 1 0 0;
}

.pattern {
	background: white;
	padding: 0.5rem 1rem;
	border-radius: 99999px;
	display: flex;
	align-items: center;
	font: var(--font-default);
	margin-right: 0.5rem;
}

.pattern-icon {
	--active-color: var(--color-theme-green-light) !important;
	margin-right: 0.5rem;
}

.pattern-score {
	color: var(--color-theme-green-light);
	font-weight: 700;
}
</style>
