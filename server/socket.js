import { Server } from 'socket.io'

let io
const rooms = {}

function generateRoomId() {
    // adapted from https://www.cs.cmu.edu/~biglou/resources/bad-words.txt
    const bad = ['abbo', 'alla', 'anal', 'anus', 'arab', 'arse', 'babe', 'barf', 'bast', 'blow', 'bomb', 'bomd', 'bong', 'boob', 'boom', 'burn', 'butt', 'chav', 'chin', 'cigs', 'clit', 'cock', 'coon', 'crap', 'cumm', 'cunn', 'cunt', 'dago', 'damn', 'dead', 'dego', 'deth', 'dick', 'died', 'dies', 'dike', 'dink', 'dive', 'dong', 'doom', 'dope', 'drug', 'dumb', 'dyke', 'fart', 'fear', 'fire', 'floo', 'fore', 'fuck', 'fuks', 'geez', 'geni', 'gipp', 'gook', 'groe', 'gypo', 'gypp', 'hapa', 'hebe', 'heeb', 'hell', 'hobo', 'hoes', 'hole', 'homo', 'honk', 'hook', 'hore', 'hork', 'horn', 'ikey', 'itch', 'jade', 'jeez', 'jiga', 'jigg', 'jism', 'jiz ', 'jizz', 'jugs', 'kike', 'kill', 'kink', 'kock', 'koon', 'krap', 'kums', 'kunt', 'kyke', 'laid', 'lezz', 'lies', 'limy', 'mams', 'meth', 'milf', 'mofo', 'moky', 'muff', 'munt', 'nazi', 'nigg', 'nigr', 'nook', 'nude', 'nuke', 'oral', 'orga', 'orgy', 'paki', 'payo', 'peck', 'perv', 'phuk', 'phuq', 'pi55', 'piky', 'pimp', 'piss', 'pixy', 'pohm', 'poon', 'poop', 'porn', 'pric', 'pros', 'pube', 'pudd', 'puke', 'puss', 'pusy', 'quim', 'ra8s', 'rape', 'rere', 'rump', 'scag', 'scat', 'scum', 'sexy', 'shag', 'shat', 'shav', 'shit', 'sick', 'skum', 'slav', 'slut', 'smut', 'snot', 'spic', 'spig', 'spik', 'spit', 'suck', 'taff', 'tang', 'tard', 'teat', 'tits', 'turd', 'twat', 'vibr', 'wank', 'wetb', 'whit', 'whiz', 'whop', 'wuss']
    const letters = 'abcdefghijklmnopqrstuvwxyz'
    let id
    // generate room ids until we find one that isn't already taken and isn't a bad word
    do {
        id = ''
        for (let i = 0; i < 4; i++) {
            id += letters.charAt(Math.floor(Math.random() * letters.length))
        }
    } while (id in io.sockets.adapter.rooms || bad.includes(id))
    return id
}

function removeRoomData(room, socket) {
    const players = rooms[room]
    delete players[socket.id]
    if (Object.keys(players).length === 0) {
        delete rooms[room]
    }
}

function setRoomData(room, socket, data) {
    if (!(room in rooms)) {
        const players = {}
        players[socket.id] = data
        rooms[room] = players
    } else {
        const players = rooms[room]
        players[socket.id] = data
    }
    socket.emit('updated', { myId: socket.id, myData: data })
    socket.broadcast.in(room).emit('otherUpdated', { theirId: socket.id, theirData: data })
}

function joinRoom(room, socket, data) {
    socket.join(room)
    setRoomData(room, socket, data)
    socket.emit('joined', {
        room: room,
        allData: rooms[room],
    })
    socket.broadcast.in(room).emit('otherJoined', {
        theirId: socket.id,
        theirData: data,
    })
}

function leaveRooms(socket) {
    socket.emit('left')
    Object.keys(socket.rooms).forEach(room => {
        removeRoomData(room, socket)
        socket.broadcast.in(room).emit('otherLeft', { theirId })
    })
}

export default function initSocket(httpServer) {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CLIENT_URL,
            meethods: ['GET', 'POST']
        }
    })

    io.on('connection', (socket) => {
        socket.on('disconnecting', () => {
            leaveRooms(socket)
        })

        socket.on('host', ({ myData }) => {
            const room = generateRoomId()
            joinRoom(room, socket, myData)
        })

        socket.on('join', ({ room, myData }) => {
            room = room.toLowerCase()
            if (!(room in rooms)) {
                //TODO: throw error?
                return
            }
            joinRoom(room, socket, myData)
        })

        socket.on('update', ({ myData }) => {
            socket.rooms.forEach(room => {
                setRoomData(room, socket, myData)
            })
        })
    })
}
