<template>
	<div class="TheBuyMenu">
		<img class="icon" src="@/assets/icons/action-buy.svg"/>
		<div class="title">Tap a tile to replace it.</div>
		<Icon class="x"
		      icon="times"
		      @click="$emit('close')"/>
		<div class="body">
			<div class="cell">
				{{ cell.text }}
			</div>
			<div class="button-group">
				<div class="button"
				     style="--color: var(--color-theme-green-light)"
				     @click="$emit('buy')">
					Try another
					<span class="button-cost">-5</span>
				</div>
				<div class="button"
				     style="--color: var(--color-theme-red)"
				     @click="$emit('close')">
					Discard
				</div>
			</div>
		</div>
	</div>
</template>



<script>
export default {
	name: 'TheBuyMenu',
	props: {
		cell: Object,
	}
}
</script>



<style scoped>
.TheBuyMenu {
	display: grid;
	grid-template-columns: 2.5rem auto 2rem;
	grid-template-areas:
		"icon title  x"
		"body body body";
	align-items: center;
	padding: 1rem;
	background-color: var(--color-theme-green);
}

.icon {
	grid-area: icon;
}

.title {
	grid-area: title;
	font: var(--font-title);
	color: var(--color-theme-white);
}

.x {
	grid-area: x;
}

.body {
	grid-area: body;
	display: flex;
	align-items: center;
	padding: 1rem 0;
}

.cell {
	width: 33.3333vw;
	height: 33.3333vw;
	background: var(--color-theme-white);
	border-radius: var(--radius-medium);
	box-shadow: 0 0.5rem 0 0 var(--color-theme-gray-lightest);
	display: flex;
	align-items: center;
	padding: 0.25rem;
	text-align: center;
}

.button-group {
	flex: 1 0 auto;
	display: flex;
	flex-direction: column;
}

.button {
	display: flex;
	height: 3rem;
	align-items: center;
	background: var(--color);
	border-top-right-radius: var(--radius-small);
}
.button:not(:last-child) {
	margin-bottom: 0.5rem;
}
</style>
