import tropes from '../../data/tropes'
import patterns from '../../data/patterns'
import { reactive, readonly, watch } from "vue"
import { sample, sampleSize } from "lodash"
import { v4 as uuid } from "uuid"
import room from './room'

//internal
const my = reactive({
    boughtTile: null,
    playerData: createPlayerData(),
})

function createPlayerData() {
    const stored = JSON.parse(localStorage.getItem('playerData'))
    return {
        name: stored?.name ?? 'Player',
        score: stored?.score ?? 20, 
        tiles: stored?.tiles ?? createRandomBoard(), 
        soldTileIds: stored?.soldTileIds ?? []
    }
}

function createTile(id) {
    const text = tropes.byId[id]
    return {text, id, selected: false, key: uuid()}
}

function createRandomTile () {
	return createTile(sample(tropes.allIds))
}

function createRandomTileArray(n) {
    return sampleSize(tropes.allIds, n).map(createTile)
}

function createRandomBoard() {
	const tiles = createRandomTileArray(9)
    tiles[4].selected = true
    return tiles
}

watch(my.playerData, nv => {
    localStorage.setItem('playerData', JSON.stringify(nv))
}, {deep: true})

export default {
    room,
    playerData: readonly(my.playerData),
    boughtTile: readonly(my.boughtTile),
    tropes: readonly(tropes),
    get sellablePatterns() {
        return patterns.filter(p => p.pattern.every(i => my.playerData.tiles[i].selected))
    },
    get playerDataSimplified () {
        const result = JSON.parse(JSON.stringify(state.playerData))
        result.tiles = result.tiles.map(t => t.selected)
        return result
    },
    discardTile() {
        my.boughtTile = null 
    },
    placeTile(i) {
        my.playerData.tiles[i] = my.boughtTile
        my.boughtTile = null
    },
    toggleTile(i) {
        my.playerData.tiles[i].selected = !my.playerData.tiles[i].selected
    },
    spells: {
        buy() {
            if (my.playerData.score < 5) throw new Error("Not enough points")
            my.playerData.score -= 5
            my.boughtTile = createRandomTile()
        },
        reset() {
            if (my.playerData.score < 20) throw new Error("Not enough points")
            my.playerData.score -= 20
            my.playerData.tiles = createRandomBoard()
        },
    },
    resetGame() {
        my.playerData.soldTileIds = []
        my.playerData.score = 20
        my.playerData.tiles = createRandomBoard()
    },
    setName(name) {
        my.playerData.name = name
    },
    sellPattern(i) {
        const {pattern, score} = patterns[i]
        my.playerData.score += score
        
        const sampleTiles = getRandomTileArray(pattern.length)
        pattern.forEach((patternTileIndex, i) => {
            const toReplace = resultTiles[patternTileIndex]
            //replace the sold tiles
            my.playerData.tiles[patternTileIndex] = sampleTiles[i]
            my.playerData.soldTileIds.push(toReplace.id)
        })
        my.playerData.tiles[4].selected = true
    },
}