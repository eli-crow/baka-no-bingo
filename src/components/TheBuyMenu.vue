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
				     style="--color: var(--green-light)"
				     @click="$emit('buy')">
					Try another
					<span class="button-cost">-5</span>
				</div>
				<div class="button"
				     style="--color: var(--red)"
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
	background-color: var(--green);
}

.icon {
	grid-area: icon;
}

.title {
	grid-area: title;
	font: var(--font-title);
	color: var(--white);
}

.x {
	grid-area: x;
	width: 1.75rem;
	height: 1.75rem;
	padding: 0.45rem;
	background-color: rgba(0,0,0,0.13);
	border-radius: 99999px;
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
	background: var(--white);
	border-radius: var(--radius-medium);
	box-shadow: 0 0.5rem 0 0 var(--gray-lightest);
	display: flex;
	align-items: center;
	padding: 0.5rem;
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
	justify-content: space-between;
	background: var(--color);
	border-top-right-radius: var(--radius-small);
	border-bottom-right-radius: var(--radius-small);
	box-shadow: 0 0.25rem 0 0 rgba(0,0,0,0.07);
	font-weight: 700;
	color: var(--white);
	padding-left: 1rem;
	padding-right: 1rem;
}
.button:not(:last-child) {
	margin-bottom: 0.5rem;
}
</style>
