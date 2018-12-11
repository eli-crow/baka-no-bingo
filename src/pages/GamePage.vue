<template>
	<div class="GamePage">
		<header class="header">
			<router-link class="back" to="/"><Icon icon="chevron-left"/></router-link>
			<div class="title">Anime Tropes</div>
		</header>
		<div class="score">
			<div class="score-title"><span class="score-title-japanese">得点</span> Score</div>
			<div class="score-count">{{ playerData.score }}</div>
		</div>
		<BingoBoard3 class="board"
		             :cells="playerData.cells"/>
		<transition name="patterns">
			<PatternSellBar :patterns="sellablePatterns" @sell="sell"/>
		</transition>
		<transition name="actions">

		</transition>
	</div>
</template>



<script>
import * as Lodash from 'lodash'
import BingoBoard3 from '@/components/BingoBoard3'
import PatternIcon from '@/components/PatternIcon'
import PatternSellBar from '@/components/PatternSellBar'
import TROPES from '@/data/tropes'

const LS_PLAYER_DATA =  'bakaNoBingoPlayerData';

const PATTERNS = [
	{pattern: [0,1,2,3,4,5,6,7,8], score: 250},
	{pattern: [0,2,4,6,8], score: 100},
	{pattern: [1,3,4,5,7], score: 100},
	{pattern: [0,1,2], score: 50},
	{pattern: [6,7,8], score: 50},
	{pattern: [0,3,6], score: 50},
	{pattern: [2,5,8], score: 50},
	{pattern: [3,4,5], score: 20},
	{pattern: [1,4,7], score: 20},
	{pattern: [0,4,8], score: 20},
	{pattern: [2,4,6], score: 20},
]

export default {
	name: 'GamePage',
	components : {
		BingoBoard3,
		PatternIcon,
		PatternSellBar,
	},
	data () {
		const lsData = localStorage.getItem(LS_PLAYER_DATA)
		const playerData = JSON.parse(lsData) || {
			score: 0,
			cells: Lodash.sampleSize(TROPES, 9).map(trope => ({text: trope, selected: false}) )
		}
		return {
			boardAccepted: false,
			playerData,
		}
	},
	computed: {
		scorePlural () {
			return this.playerData.score === 1 ? '' : 's'
		},
		sellablePatterns () {
			// clone patterns
			const patterns = JSON.parse(JSON.stringify(PATTERNS))
			// filter all patterns by whether each pattern matches the current board
			return patterns.filter(p => p.pattern.every(patternIndex => this.playerData.cells[patternIndex].selected))
		},
	},
	methods: {
		newBoard () {
			this.playerData.cells = Lodash.sampleSize(TROPES, 9).map(trope => ({text: trope, selected: false}) )
		},
		shuffleBoard () {
			const c = this.playerData.cells.slice()
			const temp = c[0]
			c[0] = c[3]
			c[3] = c[6]
			c[6] = c[7]
			c[7] = c[8]
			c[8] = c[5]
			c[5] = c[2]
			c[2] = c[1]
			c[1] = temp
			this.playerData.cells = c //bump reactive
		},
		acceptBoard () {
			this.boardAccepted = true
		},
		win () {
			this.playerData.score = this.playerData.score + 1
			this.boardAccepted = false
			this.newBoard()
		},
		sell ({pattern, score}) {
			this.playerData.score += score
			const cells = JSON.parse(JSON.stringify(this.playerData.cells))
			const sample = Lodash.sampleSize(TROPES, pattern.length)
			pattern.forEach((patternIndex, i) => {
				cells[patternIndex] = {text: sample[i], selected: false}
			})
			this.playerData.cells = cells
		}
	},
	watch: {
		playerData : {
			handler (newValue, oldValue) {
				localStorage.setItem(LS_PLAYER_DATA, JSON.stringify(this.playerData))
			},
			deep: true,
		},
	},
}
</script>



<style scoped>
.GamePage {
}

.header {
	display: flex;
	align-items: center;
	padding: 12px 16px;
	height: 16.6666666vw;
	background: white;
	position: relative;
	z-index: 1;
	background: var(--color-theme-yellow);
}
.back {
	flex: 0 0 2.25rem;
	width: 2.25rem;
	height: 2.25rem;
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 0.75rem;
	border-radius: 99999px;
	background-color: var(--color-theme-gray);
	color: white;
}
.title {
	flex: 1 1 auto;
	font: var(--font-title);
}

.score {
	position: relative;
	z-index: 1;
	text-align: center;
	height: 16.666666vw;
	display: flex;
	align-items: center;
	justify-content: space-between;
	box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.048);
	padding: 0 1rem;
}
.score-title {
	font: var(--font-title);
	font-size: 1rem;
	color: var(--color-theme-gray);
}
.score-title-japanese {
	color: var(--color-text-dark);
	font-size: 1.25rem;
}
.score-count {
	font: var(--font-title);
	font-size: 2rem;
}


.action-enter-active,
.action-leave-active {
	transition: 250ms ease;
	transition-property: opacity, transform;
}
.action-enter,
.action-leave-to {
	opacity: 0;
	transform: translateY(1rem);
}

.action-title {
	font: var(--font-title);
	background: var(--color-theme-blue);
	color: white;
	height: 3rem;
	display: flex;
	align-items: center;
	padding-left: 16px;
	padding-right: 16px;
	font-size: 1.25rem;
}

.button-group {
	display: flex;
}
.button {
	height: 33.33333vw;
	flex: 1 0 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	--color: green;
	color: var(--color);
	font: var(--font-title);
	font-size: 1rem;
}
.button.-red { --color: var(--color-theme-red) }
.button.-blue { --color: var(--color-theme-blue) }
.button.-green { --color: var(--color-theme-green) }
.button-icon {
	width: 2.5rem;
	height: 2.5rem;
	padding: 0.7rem;
	margin-bottom: 0.5rem;
	background-color: var(--color);
	border-radius: 99999px;
	color: white;
}
</style>
