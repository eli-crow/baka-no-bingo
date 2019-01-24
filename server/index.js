var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('uuid')

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

const __rooms = {}
function setRoomPlayerData (roomId, playerId, playerData) {
    const room = __rooms[roomId] = __rooms[roomId] || {}
    room[playerId] = playerData
}

// maps "playerId" : socket.id
const __playerIdToSocketId = {}

const POSSIBLE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'
function generateRoomId () {
    let id
    do {
        id = ''
        for (let i = 0; i < 4; i++) {
            id += POSSIBLE_LETTERS.charAt(Math.floor(Math.random() * POSSIBLE_LETTERS.length))
        }
    } while (id in io.sockets.adapter.rooms)
    return id
}

io.on('connection', (socket) => {
    const playerId = uuid()

    socket.emit('CONNECT')

    socket.on('disconnecting', () => {
        socket.emit('LEFT')

        delete __playerIdToSocketId[playerId]

        const joinedRooms = Object.keys(socket.rooms)
        joinedRooms.forEach(roomId => {
            if (roomId in __rooms) {
                delete __rooms[roomId][playerId]
            }
            socket.broadcast.in(roomId).emit('OTHER_LEFT', {
                playerId: playerId,
            })
        })
    })

    socket.on('disconnect', () => {
        socket.emit('DISCONNECT')
    })

    //Create a room and join it
    socket.on('host', ({playerData}) => {
        const roomId = generateRoomId()

        socket.join(roomId)
        setRoomPlayerData(roomId, playerId, playerData)
        __playerIdToSocketId[playerId] = socket.id

        //Confirm self has joined
        socket.emit('JOINED', {
            roomId: roomId,
            allPlayerData: __rooms[roomId],
        })
        //Notify others self has joined
        socket.broadcast.in(roomId).emit('OTHER_JOINED', {
            playerId: playerId,
            playerData: playerData,
        })
    })

    //Join a room
    socket.on('join', ({roomId, playerData}) => {
        roomId = roomId.toLowerCase()

        if (! (roomId in io.sockets.adapter.rooms)) {
            return
        }

        socket.join(roomId)
        setRoomPlayerData(roomId, playerId, playerData)
        __playerIdToSocketId[playerId] = socket.id

        //Confirm self has joined
        socket.emit('JOINED', {
            roomId: roomId,
            allPlayerData: __rooms[roomId],
        })
        //Notify others self has joined
        socket.broadcast.in(roomId).emit('OTHER_JOINED', {
            playerId: playerId,
            playerData: playerData,
        })
    })

    socket.on('update', ({roomId, playerData}) => {
        roomId = roomId.toLowerCase()
        setRoomPlayerData(roomId, playerId, playerData)
        //Confirm self has updated
        socket.emit('UPDATED', {playerId, playerData})
        //Notify others self has updated
        socket.broadcast.in(roomId).emit('OTHER_UPDATED', {playerId, playerData})
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});