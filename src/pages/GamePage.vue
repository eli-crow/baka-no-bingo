<template>
	<div class="GamePage">
		<GlobalEvents @keydown.space="cheat"
		              @keydown.esc="anticheat"/>

		<header class="header">
			<router-link class="back" to="/"><Icon icon="chevron-left"/></router-link>
			<p class="room">
				<span class="room-title">Room</span>
				<span class="room-id">{{ roomId }}</span>
			</p>
			<div class="scores">
				<div class="my-score">{{ playerData.score }}</div>
				<a class="players" @click="modal='players'"><Icon icon="list-ol"/></a>
			</div>
		</header>

		<div class="board-container">
			<BingoBoard3 class="board"
					     :tiles="playerData.tiles"
					     @select="handleTileSelect"/>
		</div>

		<PatternSellBar v-if="sellablePatterns.length"/>
		<PatternLegend v-else-if="!boughtTile"/>

		<transition name="action-group">
			<TheBuyMenu v-if="boughtTile"/>

			<div class="action-group"
			     v-else>
				<ActionButton class="action"
					          icon="spell-replace"
						      label="Replace"
						      color="green"
						      cost="5"
						      :enabled="playerData.score >= 5"
				              @select="$store.dispatch('SPELL_BUY')"/>

				<ActionButton class="action"
					          icon="spell-reset"
						      label="Reset"
						      color="red"
						      cost="10"
						      :enabled="playerData.score >= 10"
				              @select="$store.dispatch('SPELL_RESET_BOARD')"/>

				<ActionButton class="action"
					          icon="spell-curse"
						      label="Curse"
						      color="purple"
						      :cost="curseCost"
						      :enabled="playerData.score >= curseCost"
				              @select="modal = 'ModalCurse'"/>
			</div>
		</transition>

		<ModalTransition>
			<ModalAction v-if="modal === 'players'"
			             title="Players"
			             description="Who's in the lead?"
						 @close="modal = null">
				<PlayerList class="player-list"/>
			</ModalAction>
		</ModalTransition>
	</div>
</template>



<script>
import * as Lodash from 'lodash'
import deepFreeze from 'deep-freeze'
import uid from 'uuid'
import Vue from 'vue'
import { mapGetters, mapState } from 'vuex'

import GlobalEvents from 'vue-global-events'

import BingoBoard3 from '@/components/BingoBoard3'
import PatternIcon from '@/components/PatternIcon'
import PatternSellBar from '@/components/PatternSellBar'
import PatternLegend from '@/components/PatternLegend'
import ActionButton from '@/components/ActionButton'
import TheBuyMenu from '@/components/TheBuyMenu'
import ModalAction from '@/components/ModalAction'
import ModalTransition from '@/components/ModalTransition'
import PlayerList from '@/components/PlayerList'

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
		ModalAction,
		ModalTransition,
		PlayerList,
	},
	props: {
		resetGameOnLoad: Boolean,
	},
	data () {
		return {
			modal: '',
		}
	},
	computed: {
		...mapGetters(['sellablePatterns']),
		...mapState(['boughtTile', 'playerData', 'roomId']),
		mode () {
			if (this.boughtTile) {
				return 'bought-tile'
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
		handleTileSelect (i) {
			switch (this.mode) {
				case 'bought-tile':
					if (i === 4) return
					this.$store.commit('PLACE_REPLACEMENT', i)
					break;
				case 'playing':
					if (i === 4) return
					this.$store.commit('TOGGLE_CELL', i)
					break;
			}
		},
		cheat () {
			this.$store.commit('ADJUST_SCORE', 99999)
		},
		anticheat () {
			this.$store.commit('ADJUST_SCORE', -99999)
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
	height: 68px;
	position: relative;
	z-index: 2;
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
.room {
	flex: 1 1 auto;
}
.room-title {
	display: block;
	margin: 0;
	line-height: 1;
	text-transform: uppercase;
	font-size: 14px;
	letter-spacing: 0.07em;
	font-weight: 700;
	margin-bottom: 2px;
	opacity: 0.5;
}
.room-id {
	display: block;
	margin: 0;
	font-size: 24px;
	text-transform: uppercase;
	font-weight: 700;
	line-height: 1;
}
.scores {
	flex: 0 0 auto;
	text-align: center;
	display: flex;
	align-items: center;
	justify-content: space-between;
	font: var(--font-title);
	font-size: 2rem;
	background-color: white;
	line-height: 1;
	align-self: center;

	border-radius: 99999px;
	box-shadow: 0 4px 0 0 var(--gray-light);
	margin-left: auto;
	margin-bottom: 4px;
}
.my-score {
	padding: 8px 12px 8px 20px;
	border-right: solid 1px var(--gray-light);
}
.players {
	padding: 8px 16px 8px 12px;
	font-size: 24px;
}


.board-container {
	/* --color defined in computed property */
	background-image: linear-gradient(to bottom, var(--ambient-dark) -100%, 0%, var(--ambient));
	padding: 1rem;
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
