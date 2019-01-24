import Vue from "vue"
import Vuex from "vuex"
import Lodash from "lodash"
import uid from "uuid"

import data from '@/data/tropes'
import curses from '@/data/curses'
import session2 from '@/data/session-2'

Vue.use(Vuex)

//localStorage values
const LS_NAME =  'bakanobingo_name';

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
        boughtTile: null,
        tropes: data.tropes,
        curses: curses,
        sessions: [
            session2
        ],
        viewCurseIndex: null,

//socket.io
        isConnected: false,
        roomId: null,
        playerData: {
            name: localStorage.getItem(LS_NAME) || '',
            score: 20,
            tiles: getRandomTileArray(9, [4]),
            soldTileIds: [],
        },
        allPlayerData: {}
    },

    mutations: {
        NEW_BOARD (state, shouldReplaceCurses) {
            const tilesCopy = JSON.parse(JSON.stringify(state.playerData.tiles))
            const tilesSample = getRandomTileArray(9, [4])
            const newTiles = tilesCopy.map((t, i) => {
                return shouldReplaceCurses || t.type !== 'curse'
                    ? tilesSample[i]
                    : t
            })
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
        REPLACE_TILE (state, i) {
            const newTile = getRandomTile()
            Vue.set(state.playerData.tiles, i, newTile)
        },
        TOGGLE_TILE (state, i) {
            state.playerData.tiles[i].selected = ! state.playerData.tiles[i].selected
        },
        SET_NAME (state, name) {
            state.playerData.name = name
            localStorage.setItem(LS_NAME, name)
        },
        SET_VIEW_CURSE_INDEX (state, index) {
            state.viewCurseIndex = index
        },

//socket.io
        //Self connects
        SOCKET_CONNECT (state) {
            state.isConnected = true
        },
        //Self disconnects
        SOCKET_DISCONNECT (state) {
            state.isConnected = false
        },
        //Self joins existing room
        SOCKET_JOINED (state, {roomId, allPlayerData}) {
            state.roomId = roomId
            state.allPlayerData = allPlayerData
        },
        //Self left room
        SOCKET_LEFT (state) {
            state.roomId = null
        },
        //Self updated
        SOCKET_UPDATED (state, {playerId, playerData}) {
            Vue.set(state.allPlayerData, playerId, playerData)
        },
        //Self cursed
        SOCKET_CURSED (state, {from, curseId}) {
            const possible = [0,1,2,3,  5,6,7,8]
            const index = Lodash.sample(possible)
            const curse = getCurseTile(curseId)
            curse.from = from
            Vue.set(state.playerData.tiles, index, curse)
        },
        //Other joins room
        SOCKET_OTHER_JOINED(state, {playerId, playerData}) {
            Vue.set(state.allPlayerData, playerId, playerData)
        },
        //Other player left room
        SOCKET_OTHER_LEFT(state, {playerId}) {
            Vue.delete(state.allPlayerData, playerId)
        },
        //Other's playerData updates
        SOCKET_OTHER_UPDATED(state, {playerId, playerData}) {
            Vue.set(state.allPlayerData, playerId, playerData)
        },
    },

    actions: {
        SPELL_BUY ({commit, state}) {
            if (state.playerData.score < 5) return
            commit('ADJUST_SCORE', -5)
            commit('BUY_REPLACEMENT')
        },
        SPELL_RESET_BOARD ({commit, state}) {
            if (state.playerData.score < 10) return
            commit('ADJUST_SCORE', -10)
            commit('NEW_BOARD')
        },
        RESET_GAME ({commit}) {
            commit('CLEAR_SESSION_DATA')
            commit('SET_SCORE', 20)
            commit('NEW_BOARD', true)
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
        },
        DISPEL_CURSE ({commit}, index) {
            commit('REPLACE_TILE', index)
        },
    },

    getters: {
        allTropes ({tropes}) {
            return tropes.allIds.map(id => tropes.byId[id])
        },
        sellablePatterns ({patterns, playerData}) {
			// filter all patterns by whether each pattern matches the current board
			return patterns.filter(p => p.pattern.every(patternIndex => playerData.tiles[patternIndex].selected))
        },
        playersRanked ({allPlayerData}) {
            const copy = JSON.parse(JSON.stringify(allPlayerData))
            const result = Object.entries(copy)
                                 .map((entry) => ({id: entry[0], ...entry[1]}))
                                 .sort((a,b) => b.score - a.score)
            return result
        },
        playerDataSimplified ({playerData}) {
            const result = JSON.parse(JSON.stringify(playerData))
            result.tiles = result.tiles.map(t => t.selected)
            return result
        },
        curseCost ({playerData}) {
          return Math.floor(Math.max(20, 0.25 * playerData.score))
        },
    },
})

// tile interface: {text, selected, id, key, type}

function getCurseTile (curseId, from=null) {
    const curse = curses.byId[curseId]
    if (!curse) { return null }
    return {
        text: curse.name,
        description: curse.description,
        from: from,
        selected: false,
        id: curseId,
        key: uid(),
        type: 'curse'
    }
}

function getRandomTile () {
    const id = Lodash.sample(store.state.tropes.allIds)
    const text = store.state.tropes.byId[id]
	return {
		text: text,
        selected: false,
		id: id,
        key: uid(),
        type: 'trope',
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
            type: 'trope',
        }
	})
}

store.watch(state => state.playerData.name, newValue => {
    localStorage.setItem(LS_NAME, newValue)
})


//HACK: socket.io needs to happen after some stuff in main.js
window.setTimeout(() => {
    const socket = new Vue().$socket

    socket.on('reconnect', () => {
        if (store.state.roomId) {
            //only rejoin if we are reconnecting in the middle of a game
            socket.emit('join', {
                roomId: store.state.roomId, 
                playerData: store.getters.playerDataSimplified,
            })
        }
    })
    
    //send reduced playerData to socket server
    store.watch(state => state.playerData, newValue => {
        if (!store.state.roomId) {
            return
        }
        socket.emit('update', {
            roomId: store.state.roomId,
            playerData: store.getters.playerDataSimplified
        })
    }, {deep: true})
}, 0)

export default store