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

      if (socket.recovered) {
      }

      // handle 'disconnection' ?

      socket.on('host', (playerOptions, ack) => {
        const code = generateRoomCode(code => !this.rooms[code]);
        const room = new Room(code, this.server);
        const player = room.addPlayer(socket, playerOptions);
        this.rooms[code] = room;
        this.socketToRoomCode.set(socket, code);
        this.socketToPlayerId.set(socket, player.id);

        ack?.({
          success: true,
          myPlayerId: player.id,
          room: room.data,
        });
      });

      socket.on('join', (code, playerOptions, ack) => {
        const room = this.getRoom(code);
        if (!room) {
          ack?.({
            success: false,
          });
          return;
        }

        const player = room.addPlayer(socket, playerOptions);
        this.socketToRoomCode.set(socket, code);
        this.socketToPlayerId.set(socket, player.id);

        ack?.({
          success: true,
          myPlayerId: player.id,
          room: room.data,
        });
      });

      socket.on('leave', ack => {
        const code = this.socketToRoomCode.get(socket);
        const playerId = this.socketToPlayerId.get(socket);
        if (!code || !playerId) {
          ack?.({ success: false });
          return;
        }
        const room = this.getRoom(code);

        if (!room) {
          ack?.({ success: false });
          return;
        }

        room.removePlayer(playerId);
        ack?.({ success: true });
      });

      socket.on('sellPattern', (patternId, ack) => {
        const code = this.socketToRoomCode.get(socket);
        const playerId = this.socketToPlayerId.get(socket);
        if (!code || !playerId) {
          ack?.({
            success: false,
            error: 'noroom',
          });
          return;
        }

        const room = this.getRoom(code);

        if (!room) {
          ack?.({
            success: false,
            error: 'noroom',
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
          });
        }
      });

      socket.on('toggleCell', (index, ack) => {
        const code = this.socketToRoomCode.get(socket);
        const playerId = this.socketToPlayerId.get(socket);
        if (!code || !playerId) {
          ack?.({ success: false });
          return;
        }

        const room = this.getRoom(code);
        if (!room) {
          ack?.({ success: false });
          return;
        }

        room.toggleCell(playerId, index);
        ack?.({ success: true });
      });
    });
  }

  private getRoom(code: string) {
    return this.rooms[code.toLowerCase()];
  }
}
