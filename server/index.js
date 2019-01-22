var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('uuid')

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

const __playerData = {}

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function (socket) {
    io.emit('CONNECT', socket.id)

    socket.on('disconnect', function () {
        delete __playerData[socket.id]
        io.emit('DISCONNECT', socket.id)
    })

    socket.on('host', function ({playerData}) {
        const roomId = generateRoomId()
        socket.join(roomId)
        socket.emit('CONFIRM_HOST', {
            roomId: roomId,
            playerData: __playerData,
        })
    })

    socket.on('join', function ({roomId, playerData}) {
        __playerData[socket.id] = playerData
        if (roomId in io.sockets.adapter.rooms) {
            socket.emit('CONFIRM_GUEST', {
                roomId: roomId,
                playerData: __playerData,
            })
        }
    })

    socket.on('set_player_data', function (playerData) {
        __playerData[socket.id] = playerData
        socket.broadcast.emit('OTHER_PLAYER_UPDATED', {
            id: socket.id,
            playerData: __playerData[socket.id],
        })
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});