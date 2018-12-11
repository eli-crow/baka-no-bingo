<template>
	<div class="MainPage">
		<div class="title-container">
			<div class="title">Baka no Bingo ★ <span class="title-version">v{{ version }}</span></div>
			<div class="title title-duplicate">Baka no Bingo ★ <span class="title-version">v{{ version }}</span></div>
		</div>
		<div class="cell-group">
			<div class="cell -blue">バ</div>
			<div class="cell -blue">カ</div>
			<div class="cell -small -gray-light">の</div>
			<router-link to="/game" class="cell -text -blue-light">Continue</router-link>
			<div class="cell -star -red">★</div>
			<router-link to="/game" class="cell -text -yellow-light">New</router-link>
			<div class="cell -yellow">ビ</div>
			<div class="cell -yellow">ン</div>
			<div class="cell -yellow">ゴ</div>
		</div>
	</div>
</template>



<script>
export default {
	name: 'MainPage',
	components: {
	},
	data () {
		return {
			//TODO: refactor
			version: 2
		}
	}
}
</script>



<style scoped>
.MainPage {
}

.title-container {
	height: 33.33333vw;
	display: flex;
	padding-left: 1rem;
	align-items: center;
}

@keyframes title {
	0% { transform: none; }
	100% { transform: translateX(-100%); }
}
.title {
	white-space: nowrap;
	font: var(--font-title);
	font-size: 20vw;
	padding-right: 5vw;
	animation-name: title;
	animation-duration: 6s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

.title-version {
	position: absolute;
	color: white;
	top: 53%;
	right: 9.5vw;
	font-size: 1.25rem;
	transform: translate(-50%, -50%);
}

.cell-group {
	padding: 1rem;
	border-radius: 10px;
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
	border-bottom: var(--line-groove);
	border-right: var(--line-groove);
	margin-bottom: -2px;
	margin-right: -2px;
	font: var(--font-title);
	font-size: 20vw;
	color: var(--color-text-dark);
	text-decoration: inherit;
}
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

.cell.-small {
	font-size: 12vw;
}
.cell.-text {
	font-size: 4vw;
	text-transform: uppercase;
	letter-spacing: 0.2em;
}
.cell.-blue {
	background-color: var(--color-theme-blue);
}
.cell.-green {
	background-color: var(--color-theme-green);
}
.cell.-red {
	background-color: var(--color-theme-red);
}
.cell.-yellow {
	background-color: var(--color-theme-yellow);
}
.cell.-gray-light {
	background-color: var(--color-theme-gray-light);
}
.cell.-blue-light {
	background-color: var(--color-theme-blue-light);
}
.cell.-yellow-light {
	background-color: var(--color-theme-yellow-light);
}
</style>
