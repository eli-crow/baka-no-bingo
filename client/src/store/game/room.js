import { io } from "socket.io-client"
import { reactive, readonly, ref } from 'vue'

export function createRoomStore(onMyUpdate) {
    const socket = io(import.meta.env.VITE_WEBSOCKET_URL)

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

        joined({room: roomId, allData}) {
            console.log(roomId, allData)
            room.id = roomId
            room.playerData = allData
        },
        otherJoined({theirId, theirData}) {
            room.playerData[theirId] = theirData
        },

        left() {
            room.id = null
            playerData = {}
        },
        otherLeft({theirId}) {
            delete room.playerData[theirId]
        },

        updated({myId, myData}) {
            room.playerData[myId] = myData
            onMyUpdate(myData)
        },
        otherUpdated({theirId, theirData}) {
            room.playerData[theirId] = theirData
        },
        
        connect_error(err) {
            console.error(err)
        }
    }

    Object.entries(events).forEach(
        ([key, fn]) => {
            socket.on(key, fn)   
        }
    )

    return {
        get connected () { return room.connected },
        get id() { return room.id },
        players: readonly(room.playerData),
        get playersRanked () {
            return Object.entries(room.playerData)
                .map(([id, data]) => ({id, ...data}))
                .sort((a,b) => b.score - a.score)
        },
        host(myData) {
            socket.emit('host', {myData})
        },
        join(room, myData) {
            socket.emit('join', {room, myData})
        },
        leave() {
            throw new Error("Not Implemented");
        },
        update(myData) {
            socket.emit('update', {myData})
        }
    }    
}