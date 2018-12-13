<template>
	<div :class="{ActionButton: true, 'disabled': !enabled}"
	     :style="{'--bg-color': `var(--color-theme-${color})` }"
	     @click="$emit('select')">
		<div class="button">
			<img class="icon" :src="iconSrc"/>
			<span class="score" v-if="cost">-{{ cost }}</span>
		</div>
		<div class="label">{{ label }}</div>
	</div>
</template>



<script>
export default {
	name: 'ActionButton',
	props: {
		color: String,
		icon: String,
		label: String,
		cost: String,
		enabled: { type: Boolean, default: false },
	},
	computed: {
		iconSrc () { return require(`@/assets/icons/${this.icon}.svg`)}
	},
}
</script>



<style scoped>
.ActionButton {
	--bg-color: var(--color-theme-gray-dark);
	--text-color: var(--color-theme-white);
	--border: 0;
	text-align: center;
}
.ActionButton.disabled {
	--bg-color: var(--color-theme-gray-lightest) !important;
	--border: solid 1px var(--color-theme-gray-light) !important;
	--text-color: var(--color-theme-gray) !important;
}
.button {
	padding: 0.5rem 1rem;
	display: flex;
	align-items: center;
	border-radius: 99999px;
	background-color: var(--bg-color); /* --color assigned in template */
	border: var(--border);
	height: 3rem;
}
.icon {
	margin-right: 0.5rem;
	height: 2rem;
	width: 2rem;
}
.score {
	color: var(--text-color);
	font-weight: 700;
}
.label {
	font-weight: 700;
	text-transform: uppercase;
	margin-top: 0.5rem;
}
</style>
