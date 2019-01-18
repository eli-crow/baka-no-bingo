import Vue from "vue"
import Vuex from "vuex"
import Lodash from "lodash"
import uid from "uuid"

import data from '@/data/tropes'
import session2 from '@/data/session-2'

Vue.use(Vuex)

const LS_PLAYER_DATA =  'bakaNoBingoPlayerData';

const store = new Vuex.Store({
    state: {
        appVersion: 3,
        playTesters: ["Danni Kane", "Rachel Dause", "Maria “Labqi Airam” Iqbal", "Zach Lester", "Travis Tornquist", "Sean “Shin Bone” Yager", "Maggie Yager", "Taylor Dickens"],
        patterns: [
            {index: 0, pattern: [0,1,2,3,4,5,6,7,8], score: 250, name: 'Baka no Bingo'},
            {index: 1, pattern: [0,2,4,6,8], score: 100, name: 'Ekkusu'},
            {index: 2, pattern: [1,3,4,5,7], score: 100, name: 'Purasu'},
            {index: 3, pattern: [0,1,2], score: 50, name: 'Hashi'},
            {index: 4, pattern: [6,7,8], score: 50, name: 'Hashi'},
            {index: 5, pattern: [0,3,6], score: 50, name: 'Hashi'},
            {index: 6, pattern: [2,5,8], score: 50, name: 'Hashi'},
            {index: 7, pattern: [3,4,5], score: 20, name: 'Kiru'},
            {index: 8, pattern: [1,4,7], score: 20, name: 'Kiru'},
            {index: 9, pattern: [0,4,8], score: 20, name: 'Kiru'},
            {index: 10, pattern: [2,4,6], score: 20, name: 'Kiru'},
        ],
        boughtCell: null,
        tropes: data.tropes,
        sessions: [
            session2
        ],
        playerData: {},
    },
    mutations: {
        NEW_BOARD (state) {
            const newCells = getRandomCellArray(9)
			newCells[4].selected = true
			state.playerData.cells = newCells
        },
        INITIALIZE_PLAYER_DATA(state) {
            const lsData = localStorage.getItem(LS_PLAYER_DATA)
            const newCells = getRandomCellArray(9)
            newCells[4].selected = true
            const playerDataDefaults = {
                score: 20,
                cells: newCells,
                soldCellIds: [],
            }
            const playerData = Object.assign({}, playerDataDefaults, JSON.parse(lsData) || {})
            state.playerData = playerData
        },
        SET_SCORE (state, amount) {
            state.score = amount
        },
        ADJUST_SCORE (state, amount) {
            state.score = Math.max(0, state.score + amount)
        },
        CLEAR_SESSION_DATA (state) {
            state.playerData.soldCellIds = []
        },
        DISCARD_REPLACEMENT (state) {
            state.boughtCell = null
        },
        BUY_REPLACEMENT (state) {
			state.boughtCell = getRandomCell()
        },
        PLACE_REPLACEMENT (state) {
            Vue.set(state.playerData.cells, i, state.boughtCell)
            state.boughtCell = null
        },
        TOGGLE_CELL (state, i) {
            state.playerData.cells[i].selected = ! state.playerData.cells[i].selected
        },
    },
    actions: {
        SPELL_BUY ({commit, state}) {
            if (state.playerData.score < 5) return
            commit('ADJUST_SCORE', -5)
            commit('BUY_REPLACEMENT')
        },
        SPELL_RESET_BOARD ({commit, state}) {
            if (state.playerData.score < 20) return
            commit('ADJUST_SCORE', -20)
            commit('NEW_BOARD')
        },
        RESET_GAME ({commit}) {
            commit('SET_SCORE', 20)
            commit('CLEAR_SESSION_DATA')
            commit('NEW_BOARD')
        },
        SELL_PATTERN ({commit, state}, soldPatternIndex) {
            const {pattern, score, name} = state.patterns[soldPatternIndex]
            commit('ADJUST_SCORE', score)
            // copy cells to prevent mutation
            const resultCells = JSON.parse(JSON.stringify(state.playerData.cells))
            const sampleCells = getRandomCellArray(pattern.length)
            pattern.forEach((patternCellIndex, i) => {
                const toReplace = resultCells[patternCellIndex]
                //replace the sold cells
                resultCells[patternCellIndex] = sampleCells[i]
                state.playerData.soldCellIds.push(toReplace.id)
            })
            resultCells[4].selected = true
            state.playerData.cells = resultCells
        }
    },
    getters: {
        allTropes ({tropes}) {
            return tropes.allIds.map(id => tropes.byId[id])
        },
        sellablePatterns ({patterns, playerData}) {
			// filter all patterns by whether each pattern matches the current board
			return patterns.filter(p => p.pattern.every(patternIndex => playerData.cells[patternIndex].selected))
        }
    },
})

function getRandomCell () {
    const id = Lodash.sample(store.state.tropes.allIds)
    const text = store.state.tropes.byId[id]
	return {
		text: text,
		selected: false,
		id: id,
		key: uid(),
	}
}

function getRandomCellArray(n) {
	return Lodash.sampleSize(store.state.tropes.allIds, n).map(id => {
        const text = store.state.tropes.byId[id]
        return {
            text: text,
            selected: false,
            id: id,
            key: uid(),
        }
	})
}

store.commit('INITIALIZE_PLAYER_DATA')
store.watch(state => state.playerData, newValue => {
    localStorage.setItem(LS_PLAYER_DATA, JSON.stringify(newValue))
}, {deep: true})

export default store