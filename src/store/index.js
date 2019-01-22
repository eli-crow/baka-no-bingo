import Vue from "vue"
import Vuex from "vuex"
import Lodash from "lodash"
import uid from "uuid"

import data from '@/data/tropes'
import session2 from '@/data/session-2'

Vue.use(Vuex)

const LS_NAME =  'bakanobingo_name';

const store = new Vuex.Store({
    state: {
        isConnected: false,
        isConnectedAsHost: false,
        isConnectedAsGuest: false,
        roomId: null,

        socketTestMessage: '',
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
        boughtTile: null,
        tropes: data.tropes,
        sessions: [
            session2
        ],
        playerData: {
            id: uid(),
            name: localStorage.getItem(LS_NAME) || '',
            score: 20,
            tiles: getRandomTileArray(9, [4]),
            soldTileIds: [],
        },
        otherPlayerData: {}
    },
    mutations: {
        NEW_BOARD (state) {
            const newTiles = getRandomTileArray(9, [4])
			state.playerData.tiles = newTiles
        },
        SET_SCORE (state, amount) {
            state.playerData.score = amount
        },
        ADJUST_SCORE (state, amount) {
            state.playerData.score = Math.max(0, state.playerData.score + amount)
        },
        CLEAR_SESSION_DATA (state) {
            state.playerData.soldTileIds = []
        },
        DISCARD_REPLACEMENT (state) {
            state.boughtTile = null
        },
        BUY_REPLACEMENT (state) {
			state.boughtTile = getRandomTile()
        },
        PLACE_REPLACEMENT (state, i) {
            Vue.set(state.playerData.tiles, i, state.boughtTile)
            state.boughtTile = null
        },
        TOGGLE_CELL (state, i) {
            state.playerData.tiles[i].selected = ! state.playerData.tiles[i].selected
        },
        SET_NAME (state, name) {
            state.playerData.name = name
        },

        SOCKET_CONNECT (state) {
            state.isConnected = true
        },
        SOCKET_DISCONNECT (state) {
            state.isConnected = false
        },
        SOCKET_TEST(state, message) {
            state.socketMessage = message
        },
        SOCKET_CONFIRM_HOST(state, id) {
            state.isConnectedAsHost = true
            state.roomId = id
        },
        SOCKET_CONFIRM_GUEST(state, id) {
            state.isConnectedAsGuest = true
            state.roomId = id
        },
        SOCKET_OTHER_PLAYER_UPDATED(state, {id, playerData}) {
            state.otherPlayerData[id] = playerData
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
            commit('CLEAR_SESSION_DATA')
            commit('SET_SCORE', 20)
            commit('NEW_BOARD')
        },
        SELL_PATTERN ({commit, state}, soldPatternIndex) {
            const {pattern, score, name} = state.patterns[soldPatternIndex]
            commit('ADJUST_SCORE', score)
            // copy tiles to prevent mutation
            const resultTiles = JSON.parse(JSON.stringify(state.playerData.tiles))
            const sampleTiles = getRandomTileArray(pattern.length)
            pattern.forEach((patternTileIndex, i) => {
                const toReplace = resultTiles[patternTileIndex]
                //replace the sold tiles
                resultTiles[patternTileIndex] = sampleTiles[i]
                state.playerData.soldTileIds.push(toReplace.id)
            })
            resultTiles[4].selected = true
            state.playerData.tiles = resultTiles
        }
    },
    getters: {
        allTropes ({tropes}) {
            return tropes.allIds.map(id => tropes.byId[id])
        },
        sellablePatterns ({patterns, playerData}) {
			// filter all patterns by whether each pattern matches the current board
			return patterns.filter(p => p.pattern.every(patternIndex => playerData.tiles[patternIndex].selected))
        }
    },
})

function getRandomTile () {
    const id = Lodash.sample(store.state.tropes.allIds)
    const text = store.state.tropes.byId[id]
	return {
		text: text,
		selected: false,
		id: id,
		key: uid(),
	}
}

function getRandomTileArray(n, selectedIndices=[]) {
	return Lodash.sampleSize(data.tropes.allIds, n).map((id, i) => {
        const text = data.tropes.byId[id]
        return {
            text: text,
            selected: selectedIndices.includes(i) ? true : false,
            id: id,
            key: uid(),
        }
	})
}

store.watch(state => state.playerData.name, newValue => {
    localStorage.setItem(LS_NAME, newValue)
})


//socket.io emit
let socket

//send reduced playerData to socket server
store.watch(state => state.playerData, newValue => {
    if (!socket) socket = new Vue().$socket
    const reducedPlayerData = JSON.parse(JSON.stringify(newValue))
    reducedPlayerData.tiles = reducedPlayerData.tiles.map(t => t.selected)
    socket.emit('set_player_data', reducedPlayerData)
}, {deep: true})

export default store