<template>
	<div class="MainPage">
		<div class="title-container">
			<div class="title">Baka no Bingo ★ <span class="title-version">v{{ version }}</span></div>
			<div class="title title-duplicate">Baka no Bingo ★ <span class="title-version">v{{ version }}</span></div>
		</div>
		<div class="tile-group-container">
			<div class="tile-group-aspect-ratio">
				<div class="tile-group">
					<div class="tile -blue">ば</div>
					<div class="tile -blue">か</div>
					<div class="tile -small -white">の</div>
					<router-link to="/game" 
								class="tile -text -blue-light"
								@click.native="$store.dispatch('RESET_GAME')">New</router-link>
					<div class="tile -star -red">★</div>
					<router-link to="/game" 
								class="tile -text -yellow-light">Continue</router-link>
					<div class="tile -yellow">ビ</div>
					<div class="tile -yellow">ン</div>
					<div class="tile -yellow">ゴ</div>
				</div>
			</div>
		</div>
		<div class="credits">
			<p class="byline">A game by Eli Crow</p>
			<p class="special-thanks">Special thanks to: {{ specialThanks }}.</p>
			<router-link to="/data" class="button">Stats</router-link>
		</div>
	</div>
</template>



<script>
export default {
	name: 'MainPage',
	data () {
		return {
			//TODO: refactor all data
			version: 2,
			playTesters: ["Danni Kane", "Rachel Dause", "Maria “Labqi Airam” Iqbal", "Zach Lester", "Travis Tornquist", "Sean “Shin Bone” Yager", "Maggie Yager", "Taylor Dickens"]
		}
	},
	computed: {
		specialThanks () {
			return this.playTesters.join(', ')
		},
	},
}
</script>



<style scoped>
.MainPage {
	background: var(--yellow);
}

.title-container {
	height: 84px;
	display: flex;
	padding-left: 1rem;
	padding-top: 2rem;
	align-items: center;
}

@keyframes title {
	0% { transform: none; }
	100% { transform: translateX(-100%); }
}
.title {
	white-space: nowrap;
	font: var(--font-title);
	font-size: 8rem;
	letter-spacing: -0.03em;
	padding-right: 2rem;
	will-change: transform;
	animation-name: title;
	animation-duration: 6s;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

.title-version {
	position: absolute;
	color: white;
	top: 53%;
	right: 4.5rem;
	font-size: 1.25rem;
	letter-spacing: 0;
	transform: translate(-50%, -50%);
}

.tile-group-container {
	--border-scale: 0.85;
	--tile-padding: 8px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 1rem 1rem calc(var(--border-scale) * 14.88px) 1rem;
}
.tile-group-aspect-ratio {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	max-width: 25rem;
	box-sizing: content-box;
}
.tile-group-aspect-ratio::before {
	content: '';
	width: 0;
	height: 0;
	padding-bottom: 100%;
}
.tile-group {
	position: absolute;
	left: 0;
	top: 0;
	width: 100%;
	height: 100%;
	padding-bottom: var(--border-scale) * 14.88px;
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	grid-template-rows: 1fr 1fr 1fr;
	border-top: var(--line-groove);
	border-bottom: var(--line-groove);
	border-color: transparent;
}
.tile {
	/* 
	set min-width and -height to override default tile sizing behavior
	allowing consistently sized tiles.
	*/
	min-width: 0;
	min-height: 0;
	position: relative;
	border-image-slice: 36% 36% 50% 36% fill;
	border-image-width: calc(var(--border-scale) * 36px) calc(var(--border-scale) * 36px) calc(var(--border-scale) * 50px) calc(var(--border-scale) * 36px);
	border-image-repeat: stretch;
	border-image-outset: 0px 0px calc(var(--border-scale)*14.88px) 0px;
	border-style: solid;
	padding: var(--tile-padding);
	/* margin-bottom: calc(var(--border-scale) * -14.88px); */
	/* padding-bottom: calc(var(--border-scale) * 14.88px + var(--tile-padding)); */
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	font-weight: 700;
	font-size: 4rem;
}
.tile.-small {
	font-size: 2rem;
}
.tile.-text {
	position: relative;
	font-size: 1rem;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	font-weight: 700;
	color: black;
	text-decoration: none;
}
.tile.-text::after {
	position: absolute;
	content: '';
	left: 50%;
	top: 50%;
	width: 4rem;
	height: 4rem;
	transform: translate(-50%,-50%);
	background-color: var(--circle);
	border-radius: 99999px;
	pointer-events: none;
	/* HACK: you can do better than this */
	mix-blend-mode: darken;
}
.tile.-blue {
	--circle: var(--blue);
	border-image-source: url('../assets/images/tile-blue.svg');
}
.tile.-red {
	--circle: var(--red);
	border-image-source: url('../assets/images/tile-red.svg');
}
.tile.-yellow {
	--circle: var(--yellow);
	border-image-source: url('../assets/images/tile-yellow.svg');
}
.tile.-white {
	--circle: var(--white);
	border-image-source: url('../assets/images/tile-white.svg');
}
.tile.-blue-light {
	--circle: var(--blue);
	border-image-source: url('../assets/images/tile-light-blue.svg');
}
.tile.-yellow-light {
	--circle: var(--yellow);
	border-image-source: url('../assets/images/tile-light-yellow.svg');
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

.button {
	display: flex;
	width: min-content;
	margin-top: 1.5rem;
	margin-bottom: 1rem;
	padding: 0.25rem 1rem;
	border-radius: 2px; 
	background-color: var(--yellow-dark);
	font-weight: 700;
	color: inherit;
	text-decoration: inherit;
}
</style>
