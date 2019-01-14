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
			<router-link :to="{name: 'Game', params: {resetGameOnMount: true} }" class="cell -text -blue-light">New</router-link>
			<div class="cell -star -red">★</div>
			<router-link to="/game" class="cell -text -yellow-light">Continue</router-link>
			<div class="cell -yellow">ビ</div>
			<div class="cell -yellow">ン</div>
			<div class="cell -yellow">ゴ</div>
		</div>
		<div class="credits">
			<p class="byline">A game by Eli Crow</p>
			<p class="special-thanks">Special thanks to: {{ speciaThanks }}.</p>
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
			//TODO: refactor all data
			version: 2,
			playTesters: ["Danni Kane", "Rachel Dause", "Zac Lester", "Travis Tornquist", "Sean Yager"]
		}
	},
	computed: {
		speciaThanks () {
			return this.playTesters.join(', ')
		},
	},
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
	font-size: 5vw;
	transform: translate(-50%, -50%);
}

.cell-group {
	position: relative;
	padding: 1rem;
	border-radius: var(--radius-medium);
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: repeat(3, 33.33333vw);
	overflow: hidden;
	border-top: var(--line-groove);
	border-bottom: var(--line-groove);
}
.cell-group::after {
	position: absolute;
	content: '';
	top: 1rem;
	left: 1rem;
	width: calc(100% - 2rem);
	height: calc(100% - 1.5rem);
	background-image: linear-gradient(to bottom, white, 30%, black);
	opacity: 0.25;
	mix-blend-mode: overlay;
	pointer-events: none;
	border-radius: inherit;
}

.cell {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	padding: 8px;
	font: var(--font-title);
	font-size: 20vw;
	color: var(--color-text-dark);
	text-decoration: inherit;
	background-color: var(--light);
	box-shadow: 0 0.5rem 0 0 var(--dark);
	border: solid 1px var(--dark);
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
	font-size: 14vw;
}
.cell.-text {
	position: relative;
	font-size: 4vw;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	font-weight: 700;
}
.cell.-text::after {
	position: absolute;
	content: '';
	left: 50%;
	top: 50%;
	width: 16vw;
	height: 16vw;
	transform: translate(-50%,-50%);
	background-color: var(--dark);
	border-radius: 99999px;
	pointer-events: none;
	/* HACK: you can do better than this */
	mix-blend-mode: darken;
}
.cell.-blue {
	--light: var(--blue);
	--dark: var(--blue-dark);
}
.cell.-red {
	--light: var(--red);
	--dark: var(--red-dark);
}
.cell.-yellow {
	--light: var(--yellow);
	--dark: var(--yellow-dark);
}
.cell.-gray-light {
	--light: var(--gray-lightest);
	--dark: var(--gray-light);
}
.cell.-blue-light {
	--light: var(--blue-light);
	--dark: var(--blue);
}
.cell.-yellow-light {
	--light: var(--yellow-light);
	--dark: var(--yellow);
}


.credits {
	padding: 0 1rem;
}

.byline {
	font-weight: 700;
	margin-bottom: 0.5rem;
}

.special-thanks {
	margin-top: 0;
}
</style>
