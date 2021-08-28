import { io } from "socket.io-client"
import { reactive, readonly } from 'vue'

export function createRoomStore() {
    const socket = io()

    const room = reactive({
        connected: false,
        id: null,
        playerData: {}
    })

    const events = {
        connect() {
            room.connected = true
        },
        disconnect() {
            room.connected = false
        },
        joined({roomId, allData}) {
            room.id = roomId
            room.playerData = allData
        },
        left() {
            room.id = null
        },
        updated({myId, myData}) {
            room.playerData[myId] = myData
        },
        otherJoined({theirId, theirData}) {
            room.playerData[theirId] = theirData
        },
        otherLeft({theirId}) {
            delete room[theirId]
        },
        otherUpdated({theirId, theirData}) {
            room.playerData[theirId] = theirData
        }
    }

    Object.entries(events).forEach(
        ([key, fn]) => socket.on(key, fn)
    )

    return {
        connected: readonly(room.connected),
        id: readonly(room.id),
        playerData: readonly(room.playerData),
        get playersRanked () {
            return Object.entries(room.playerData)
                .map(([id, data]) => ({id, ...data}))
                .sort((a,b) => b.score - a.score)
        },
    }    
}