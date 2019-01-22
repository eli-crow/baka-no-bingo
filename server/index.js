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

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function (socket) {
    io.emit('CONNECT')

    socket.on('disconnect', function () {
        io.emit('DISCONNECT')
    })
    socket.on('host', function () {
        const id = generateRoomId()
        socket.join(id)
        socket.emit('CONFIRM_HOST', id)
    })
    socket.on('join', function (id) {
        if (id in io.sockets.adapter.rooms) {
            socket.emit('CONFIRM_GUEST', id)
        }
    })
    socket.on('set_player_data', function (playerData) {
        socket.playerData = playerData
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});