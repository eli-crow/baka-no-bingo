import { generateRoomCode } from '../../shared/src/index.js';
import { Room } from './Room.js';
import { AppSocketServer } from './type.js';

export default class RoomCoordinator {
  private rooms: { [roomCode: string]: Room | undefined } = {};

  private server: AppSocketServer;

  constructor(server: AppSocketServer) {
    this.server = server;
    this.setupEvents();
  }

  private setupEvents() {
    this.server.on('connection', socket => {
      socket.on('disconnecting', () => {
        // leave rooms
      });

      socket.on('host', playerOptions => {
        const code = generateRoomCode(code => !this.rooms[code]);
        const room = new Room(code, this.server);
        room.addPlayer(socket, playerOptions);
      });

      socket.on('join', (code, playerOptions) => {
        const room = this.getRoomOrThrow(code);
        room.addPlayer(socket, playerOptions);
      });

      socket.on('updatePlayer', options => {});
    });
  }

  private getRoomOrThrow(code: string) {
    const room = this.rooms[code.toLowerCase()];
    if (!room) {
      throw new Error(`Room ${code} does not exist`);
    }
    return room;
  }
}
