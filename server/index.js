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
//BAD_WORDS adapted from https://www.cs.cmu.edu/~biglou/resources/bad-words.txt
const BAD_WORDS = ['abbo', 'alla', 'anal', 'anus', 'arab', 'arse', 'babe', 'barf', 'bast', 'blow', 'bomb', 'bomd', 'bong', 'boob', 'boom', 'burn', 'butt', 'chav', 'chin', 'cigs', 'clit', 'cock', 'coon', 'crap', 'cumm', 'cunn', 'cunt', 'dago', 'damn', 'dead', 'dego', 'deth', 'dick', 'died', 'dies', 'dike', 'dink', 'dive', 'dong', 'doom', 'dope', 'drug', 'dumb', 'dyke', 'fart', 'fear', 'fire', 'floo', 'fore', 'fuck', 'fuks', 'geez', 'geni', 'gipp', 'gook', 'groe', 'gypo', 'gypp', 'hapa', 'hebe', 'heeb', 'hell', 'hobo', 'hoes', 'hole', 'homo', 'honk', 'hook', 'hore', 'hork', 'horn', 'ikey', 'itch', 'jade', 'jeez', 'jiga', 'jigg', 'jism', 'jiz ', 'jizz', 'jugs', 'kike', 'kill', 'kink', 'kock', 'koon', 'krap', 'kums', 'kunt', 'kyke', 'laid', 'lezz', 'lies', 'limy', 'mams', 'meth', 'milf', 'mofo', 'moky', 'muff', 'munt', 'nazi', 'nigg', 'nigr', 'nook', 'nude', 'nuke', 'oral', 'orga', 'orgy', 'paki', 'payo', 'peck', 'perv', 'phuk', 'phuq', 'pi55', 'piky', 'pimp', 'piss', 'pixy', 'pohm', 'poon', 'poop', 'porn', 'pric', 'pros', 'pube', 'pudd', 'puke', 'puss', 'pusy', 'quim', 'ra8s', 'rape', 'rere', 'rump', 'scag', 'scat', 'scum', 'sexy', 'shag', 'shat', 'shav', 'shit', 'sick', 'skum', 'slav', 'slut', 'smut', 'snot', 'spic', 'spig', 'spik', 'spit', 'suck', 'taff', 'tang', 'tard', 'teat', 'tits', 'turd', 'twat', 'vibr', 'wank', 'wetb', 'whit', 'whiz', 'whop', 'wuss']
function generateRoomId () {
    let id
    //generate room ids until we find one that isn't already taken and isn't a bad word
    do {
        id = ''
        for (let i = 0; i < 4; i++) {
            id += POSSIBLE_LETTERS.charAt(Math.floor(Math.random() * POSSIBLE_LETTERS.length))
        }
    } while (id in io.sockets.adapter.rooms || BAD_WORDS.includes(id))
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

    socket.on('curse', ({targetPlayerId, curseId}) => {
        const targetSocketId = __playerIdToSocketId[targetPlayerId]
        io.to(targetSocketId).emit('CURSED', {
            from: playerId,
            curseId: curseId,
        })
    })
})

http.listen(3000, function(){
    console.log('listening on *:3000');
});