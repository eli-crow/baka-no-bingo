<script setup>
import { computed } from "@vue/reactivity"

const props = defineProps({
	color: { type: String, default: 'blue' },
	icon: { type: String, required: true },
	label: { type: String, required: true },
	cost: { type: [Number, String], required: true},
	enabled: { type: Boolean, default: false },
})

const iconSrc = computed(() => import(`../assets/icons/${props.icon}.svg`))
</script>



<template>
  <div
    :class="{ActionButton: true, 'disabled': !enabled}"
    :style="{'--bg-color': `var(--${color})` }"
    @click="emit('select')"
  >
    <div class="button">
      <img
        class="icon"
        :src="iconSrc"
      >
      <span
        v-if="cost"
        class="score"
      >-{{ cost }}</span>
    </div>
    <div class="label">
      {{ label }}
    </div>
  </div>
</template>



<style scoped>
.ActionButton {
	--bg-color: var(--gray-dark);
	--text-color: var(--white);
	--border: 0;
	text-align: center;
}
.ActionButton.disabled {
	--bg-color: var(--gray-lightest) !important;
	--border: solid 1px var(--gray-light) !important;
	--text-color: var(--gray) !important;
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
