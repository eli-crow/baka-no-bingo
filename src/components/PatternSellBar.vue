<template>
	<div class="PatternSellBar">
		<div class="title">売る Sell!</div>
		<div class="pattern-group">
			<div class="pattern"
			     v-for="p in sellablePatterns"
			     :key="p.index"
			     @click="$store.dispatch('SELL_PATTERN', p.index)">
				<PatternIcon class="pattern-icon"
				             :pattern="p.pattern.join('')"/>
				<span class="pattern-score">+{{ p.score }}</span>
			</div>
		</div>
	</div>
</template>



<script>
import PatternIcon from '@/components/PatternIcon'

import { mapGetters } from "vuex";

export default {
	name: 'PatternSellBar',
	components: {
		PatternIcon,
	},
	computed: {
		...mapGetters(['sellablePatterns'])
	}
}
</script>



<style scoped>
.PatternSellBar {
	background: var(--blue);
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
	--active-color: var(--green-light) !important;
	margin-right: 0.5rem;
}

.pattern-score {
	color: var(--green-light);
	font-weight: 700;
}
</style>
