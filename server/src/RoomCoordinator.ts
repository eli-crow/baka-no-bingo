import { generateRoomCode } from '../../shared/src/index.js';
import { Room } from './Room.js';
import { AppSocket, AppSocketServer } from './type.js';

export default class RoomCoordinator {
  private rooms: { [roomCode: string]: Room | undefined } = {};
  private socketToRoomCode: WeakMap<AppSocket, string> = new WeakMap();
  private socketToPlayerId: WeakMap<AppSocket, string> = new WeakMap();

  private server: AppSocketServer;

  constructor(server: AppSocketServer) {
    this.server = server;
    this.setupEvents();
  }

  private setupEvents() {
    this.server.on('connection', socket => {
      if (process.env.NODE_ENV === 'development') {
        socket.onAny((event, ...args) => {
          console.log(event, args);
        });
      }

      // handle 'disconnectiong' ?

      socket.on('host', playerOptions => {
        const code = generateRoomCode(code => !this.rooms[code]);
        const room = new Room(code, this.server);
        const player = room.addPlayer(socket, playerOptions);
        this.rooms[code] = room;
        this.socketToRoomCode.set(socket, code);
        this.socketToPlayerId.set(socket, player.id);
      });

      socket.on('join', (code, playerOptions, ack) => {
        const room = this.getRoom(code);
        if (!room) {
          ack?.({
            success: false,
            error: 'noroom',
            message: 'Room does not exist.',
          });
          return;
        }

        const player = room.addPlayer(socket, playerOptions);
        this.socketToRoomCode.set(socket, code);
        this.socketToPlayerId.set(socket, player.id);

        ack?.({ success: true });
      });

      socket.on('leave', () => {
        const code = this.socketToRoomCode.get(socket);
        const playerId = this.socketToPlayerId.get(socket);
        if (!code || !playerId) {
          return;
        }
        const room = this.getRoom(code);

        if (!room) {
          return;
        }

        room.removePlayer(playerId);
        socket.emit('left');
      });

      socket.on('sellPattern', (patternId, ack) => {
        const code = this.socketToRoomCode.get(socket);
        const playerId = this.socketToPlayerId.get(socket);
        if (!code || !playerId) {
          ack?.({
            success: false,
            error: 'noroom',
            message: 'Player is not in a room.',
          });
          return;
        }

        const room = this.getRoom(code);

        if (!room) {
          ack?.({
            success: false,
            error: 'noroom',
            message: 'Room does not exist.',
          });
          return;
        }

        try {
          room.sellPattern(playerId, patternId);
          ack?.({ success: true });
        } catch (e: any) {
          ack?.({
            success: false,
            error: 'cant',
            message: e.message,
          });
        }
      });

      socket.on('toggleCell', index => {
        const code = this.socketToRoomCode.get(socket);
        const playerId = this.socketToPlayerId.get(socket);
        if (!code || !playerId) {
          return;
        }

        const room = this.getRoom(code);
        if (!room) {
          return;
        }

        room.toggleCell(playerId, index);
      });

      socket.on('updatePlayer', options => {});
    });
  }

  private getRoom(code: string) {
    return this.rooms[code.toLowerCase()];
  }
}
