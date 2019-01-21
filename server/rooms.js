const __activeRooms = {}

const POSSIBLE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'

function generateId () {
    let id
    do {
        id = ''
        for (let i = 0; i < 4; i++) {
            id += POSSIBLE_LETTERS.charAt(Math.floor(Math.random() * POSSIBLE_LETTERS.length))
        }
    } while (id in __activeRooms)
    return id
}

//TODO: use Promises
module.exports = {
    create: function () {
        const id = generateId()
        const room = {id, players: []}
        __activeRooms[id] = room
        return id
    },
    destroy: function (id) {
        if (id in __activeRooms) {
            delete __activeRooms[id]
            return true
        } else {
            console.log(`Room "${id}" does not exist.`)
            return false
        }
    },
    join: function (id, playerId) {
        if (id in __activeRooms) {
            __activeRooms[id].players.push(playerId)
            return id
        } else {
            console.log(`Room "${id}" does not exist.`)
            return null
        }
    },
    leave: function (id, playerId) {
        if (id in __activeRooms) {
            const players = __activeRooms[id].players
            players.splice(players.indexOf(playerId), 1)
            if (players.length <= 0) {
                this.destroy(id)
            }
            return id
        } else {
            console.log(`Room "${id}" does not exist.`)
            return null
        }
    }
}