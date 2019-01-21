var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('uuid')
var rooms = require('./rooms')

app.get('/', function(req, res){
  res.send('<h1>Hello world</h1>');
});

io.on('connection', function (socket) {
    io.emit('CONNECT')
    const playerId = uuid()

    socket.on('disconnect', function () {
        io.emit('DISCONNECT')
    })
    socket.on('host', function () {
        const id = rooms.create()
        socket.emit('CONFIRM_HOST', id)
    })
    socket.on('join', function (id) {
        const success = rooms.join(id)
        if (success) {
            socket.emit('CONFIRM_GUEST', id)
        }
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});