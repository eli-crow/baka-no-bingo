<template>
	<div class="GamePage">
		<header class="header">
			<router-link class="back" to="/"><Icon icon="chevron-left"/></router-link>
			<div class="title">Anime Tropes</div>
		</header>
		<BingoBoard3 class="board"
		             :cells="cells"
				 :enabled="boardAccepted"
				 @win="win"/>
		<transition name="action" mode="out-in">
			<div class="action"
			     v-if="!boardAccepted"
			     key="action">
				<div class="action-title">選ぶ&nbsp;&nbsp;Pick a Board</div>
				<div class="button-group">
					<div class="button -red" @click="newBoard"><Icon class="button-icon" icon="trash"/> New</div>
					<div class="button -blue" @click="shuffleBoard"><Icon class="button-icon" icon="redo"/> Shuffle</div>
					<div class="button -green" @click="acceptBoard"><Icon class="button-icon" icon="check"/> Accept</div>
				</div>
			</div>
			<div class="score"
			     v-else
			     key="score">
			     <div class="score-title"><span class="score-title-japanese">得点</span> Score</div>
			     <div class="score-count">{{ score }} Board{{ score === 0 || score > 1 ? "s" : ''}}</div>
			</div>
		</transition>
	</div>
</template>



<script>
import * as Lodash from 'lodash'
import BingoBoard3 from '@/components/BingoBoard3'

const TROPES = [
	"Female dies for male backstory",
	"Laying on back with legs up, twitching",
	"Male accidentally gropes female",
	"Unneccesary grunting",
	"Echoey aside where character explains exactly how they are feeling",
	"Interruption with awkward pause",
	"A masked villain is revealed",
	"Studious main character wistfully stares out the window",
	"75%+ of females have unusually large breasts",
	"Villain is brother/father of main character",
	"Surpassing limits of strength when friends cheer them on",
	"Shouting and flexing to power up",
	"Camera pans across a buffet of food. Characters audibly gasp",
	"Geometric patterns when a character is casting magic",
	"Female is introduced with a camera pan from feet to head",
	"Male deliberately keeps important info from female to protect them",
	"Main character has big, brightly colored hair to distinguish them from background characters",
	"Character is odd-eyed, or has special eye pattern / color",
	"Blood spurts from nose profusely",
	"Something is called Kawaii",
	"Someone says Senpai",
	"Someone is secretly into senpai but acts mean to them",
	"Someone says BAKA",
	"Someone goes into Chibi form",
	"Character explains something obvious or recent to the audience",
	"Glasses sheen when a character pushes them back into place",
]

export default {
	name: 'GamePage',
	components : {
		BingoBoard3
	},
	data () {
		return {
			boardAccepted: false,
			score: 0,
			cells: Lodash.sampleSize(TROPES, 9).map(trope => ({text: trope, selected: false}) ),
		}
	},
	methods: {
		newBoard () {
			this.cells = Lodash.sampleSize(TROPES, 9).map(trope => ({text: trope, selected: false}) )
		},
		shuffleBoard () {
			const c = this.cells.slice()
			const temp = c[0]
			c[0] = c[3]
			c[3] = c[6]
			c[6] = c[7]
			c[7] = c[8]
			c[8] = c[5]
			c[5] = c[2]
			c[2] = c[1]
			c[1] = temp
			this.cells = c //bump reactive
		},
		acceptBoard () {
			this.boardAccepted = true
		},
		win () {
			this.score = this.score + 1
			this.boardAccepted = false
			this.newBoard()
		}
	}
}
</script>



<style scoped>
.GamePage {
}

.header {
	display: flex;
	align-items: center;
	padding: 12px 16px;
	height: 5rem;
	background: white;
	box-shadow: 0 8px 0 0 rgba(0, 0, 0, 0.048);
	position: relative;
	z-index: 1;
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
	text-align: center;
	height: 33.333333vw;
	display: flex;
	align-content: center;
	justify-content: center;
	flex-direction: column;
}
.score-title {
	margin-bottom: 0.5rem;
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
