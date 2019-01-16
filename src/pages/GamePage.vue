<template>
	<div class="GamePage">
		<GlobalEvents @keydown.space="cheat"
		              @keydown.esc="anticheat"/>

		<header class="header">
			<router-link class="back" to="/"><Icon icon="chevron-left"/></router-link>
			<div class="title">Anime Tropes</div>
			<Icon class="info-button" 
			      icon="clipboard"
				  @click="copySessionData"/>
		</header>

		<div class="score">
			<div class="score-title"><span class="score-title-japanese">得点</span> Score</div>
			<div class="score-count">{{ playerData.score }}</div>
		</div>

		<div class="board-container"
		     :style="boardContainerStyle">
			<BingoBoard3 class="board"
					     :cells="playerData.cells"
					     @select="handleCellSelect"/>
		</div>

		<PatternSellBar v-if="sellablePatterns.length"
					    :patterns="sellablePatterns"
					    @sell="sell"/>

		<PatternLegend v-else-if="!boughtCell"/>

		<transition name="action-group">
			<TheBuyMenu v-if="boughtCell"
			            :cell="boughtCell"
					    @buy="buy"
					    @close="boughtCell = null"/>

			<div class="action-group"
			     v-else>
				<ActionButton class="action"
					          icon="action-buy"
						      label="Buy"
						      color="green"
						      cost="5"
						      :enabled="playerData.score >= 5"
				              @select="buy"/>

				<ActionButton class="action"
				              icon="action-shuffle"
				              label="Shuffle"
				              color="blue"
				              cost="10"
				              :enabled="playerData.score >= 10"
				              @select="shuffle"/>

				<ActionButton class="action"
					          icon="action-reset"
						      label="Reset"
						      color="red"
						      cost="20"
						      :enabled="playerData.score >= 20"
				              @select="reset"/>
			</div>
		</transition>
	</div>
</template>



<script>
import * as Lodash from 'lodash'
import deepFreeze from 'deep-freeze'
import uid from 'uuid'
import Vue from 'vue'

import GlobalEvents from 'vue-global-events'

import BingoBoard3 from '@/components/BingoBoard3'
import PatternIcon from '@/components/PatternIcon'
import PatternSellBar from '@/components/PatternSellBar'
import PatternLegend from '@/components/PatternLegend'
import ActionButton from '@/components/ActionButton'
import TheBuyMenu from '@/components/TheBuyMenu'

import DATA from '@/data/tropes'

const TROPES = DATA.tropes.allIds.map(id => ({id: id, text: DATA.tropes.byId[id]}) )
const LS_PLAYER_DATA =  'bakaNoBingoPlayerData';

const PATTERNS = deepFreeze([
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
]);

function getRandomCell () {
	const trope = Lodash.sample(TROPES)
	return {
		text: trope.text,
		selected: false,
		id: trope.id,
		key: uid(),
	}
}

function getRandomCellArray(n) {
	return Lodash.sampleSize(TROPES, n).map(trope => ({
		text: trope.text,
		selected: false,
		id: trope.id,
		key: uid(),
	}))
}

export default {
	name: 'GamePage',
	components : {
		BingoBoard3,
		PatternIcon,
		PatternSellBar,
		PatternLegend,
		ActionButton,
		TheBuyMenu,
		GlobalEvents,
	},
	props: {
		resetGameOnLoad: Boolean,
	},
	data () {
		const lsData = localStorage.getItem(LS_PLAYER_DATA)
		const newCells = getRandomCellArray(9)
		newCells[4].selected = true
		const playerDataDefaults = {
			score: 20,
			cells: newCells,
			soldCellIds: [],
		}
		const playerData = Object.assign({}, playerDataDefaults, JSON.parse(lsData) || {})
		return {
			boughtCell: null,
			playerData,
		}
	},
	computed: {
		sellablePatterns () {
			// clone patterns
			const patterns = JSON.parse(JSON.stringify(PATTERNS))
			// filter all patterns by whether each pattern matches the current board
			return patterns.filter(p => p.pattern.every(patternIndex => this.playerData.cells[patternIndex].selected))
		},
		boardContainerStyle () {
			return `--color: var(--${
				this.boughtCell ? 'green' :
				this.sellablePatterns.length ? 'blue' :
				'blue-gray-light'
			});`
		},
		mode () {
			if (this.boughtCell) {
				return 'bought-cell'
			}
			else {
				return 'playing'
			}
		},
	},
	methods: {
		copySessionData () {
			this.$copyText(JSON.stringify(this.playerData))
		},
		handleCellSelect (i) {
			switch (this.mode) {
				case 'bought-cell':
					if (i === 4) return
					Vue.set(this.playerData.cells, i, this.boughtCell)
					this.boughtCell = null
					break;
				case 'playing':
					if (i === 4) return
					this.playerData.cells[i].selected = ! this.playerData.cells[i].selected
					break;
			}
		},
		newBoard () {
			const newCells = getRandomCellArray(9)
			newCells[4].selected = true
			this.playerData.cells = newCells
		},
		resetGame () {
			this.playerData.score = 20
			this.playerData.soldCellIds = []
			this.newBoard()
		},
		win () {
			this.playerData.score = this.playerData.score + 1
			this.newBoard()
		},
		sell ({pattern, score}) {
			this.playerData.score += score
			// copy cells to prevent mutation
			const resultCells = JSON.parse(JSON.stringify(this.playerData.cells))
			const sampleCells = getRandomCellArray(pattern.length)
			pattern.forEach((patternIndex, i) => {
				const toReplace = resultCells[patternIndex]
				//replace the sold cells
				resultCells[patternIndex] = sampleCells[i]
				this.playerData.soldCellIds.push(toReplace.id)
			})
			resultCells[4].selected = true
			this.playerData.cells = resultCells
		},
		buy () {
			if (this.playerData.score < 5) return
			this.playerData.score -= 5
			this.boughtCell = getRandomCell()
		},
		shuffle () {
			if (this.playerData.score < 10) return
			this.playerData.score -= 10
			//shuffle and make sure the center doesn't move, kinda hacky.
			let cells = this.playerData.cells.slice()
			const center = cells[4]
			cells = Lodash.shuffle(cells)
			const centerNewIdx = cells.indexOf(center)
			const newCenter = cells[4]
			cells[4] = center
			cells[centerNewIdx] = newCenter
			this.playerData.cells = cells
		},
		reset () {
			if (this.playerData.score < 20) return
			this.playerData.score -= 20
			this.newBoard()
		},
		cheat () {
			this.playerData.score += 99999
		},
		anticheat () {
			this.playerData.score = Math.max(0, this.playerData.score - 99999 )
		},
	},
	watch: {
		playerData : {
			handler (newValue, oldValue) {
				localStorage.setItem(LS_PLAYER_DATA, JSON.stringify(this.playerData))
			},
			deep: true,
		},
	},
	created () {
		if (this.resetGameOnLoad) {
			this.resetGame()
		}
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
	z-index: 2;
	background: var(--yellow);
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
	background-color: rgba(0, 0, 0, 0.1);
	color: var(--black);
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
	padding: 0 1rem;
}
.score-title {
	font: var(--font-title);
	font-size: 1rem;
	color: var(--gray);
}
.score-title-japanese {
	color: var(--color-text-dark);
	font-size: 1.25rem;
}
.score-count {
	font: var(--font-title);
	font-size: 2rem;
}


.board-container {
	/* --color defined in computed property */
	background-image: linear-gradient(
		to top,
		var(--color),
		var(--blue-gray-light) 66.66666vw
	);
	padding: 1rem 1rem 0;
}


.action-group {
	padding-top: 1rem;
	display: flex;
	justify-content: space-around;
}
.action {
	flex: 0 1 auto;
}
.action-group-enter-active,
.action-group-leave-active {
	transition: 250ms ease;
	transition-property: opacity, transform;
}
.action-group-leave-active {
	position: absolute;
	width: 100%;
}
.action-group-enter,
.action-group-leave-to {
	opacity: 0;
	transform: translateY(1rem);
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
.button.-red { --color: var(--red) }
.button.-blue { --color: var(--blue) }
.button.-green { --color: var(--green) }
.button-icon {
	width: 2.5rem;
	height: 2.5rem;
	padding: 0.7rem;
	margin-bottom: 0.5rem;
	background-color: var(--color);
	border-radius: 99999px;
	color: white;
}

.info-button {
	border: solid 1px var(--gray-light);
	padding: .25rem;
	width: 1.75rem;
	height: 1.75rem;
	border-radius: 2px;
	color: var(--gray-light);
	mix-blend-mode: multiply;
} 
</style>
