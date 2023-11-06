import {
  CellPatternId,
  PATTERNS,
  PlayerData,
  PlayerDataOptions,
  RoomData,
  ServerToClientEvents,
  createPlayerData,
  createRoomData,
  replaceBoardPattern,
  toggleCell,
} from '../../shared/src/index.js';
import { AppSocket, AppSocketServer } from './type.js';

export class Room {
  private data: RoomData;

  private sockets: { [playerId: string]: AppSocket | undefined } = {};

  constructor(
    code: string,
    private server: AppSocketServer
  ) {
    this.data = createRoomData(code);
  }

  addPlayer(socket: AppSocket, options: PlayerDataOptions) {
    const playerData = createPlayerData(options);

    this.sockets[playerData.id] = socket;
    this.data.players[playerData.id] = playerData;

    socket.join(this.data.code);
    socket.emit('joined', playerData, this.data);
    this.broadcast('otherJoined', playerData);

    return playerData;
  }

  removePlayer(id: string) {
    delete this.sockets[id];
    delete this.data.players[id];

    const socket = this.sockets[id];

    if (!socket) {
      return;
    }

    socket.leave(this.data.code);

    socket.emit('left');
    this.broadcast('otherLeft', id);
  }

  sellPattern(playerId: string, patternId: CellPatternId) {
    this.doForPlayer(playerId, player => {
      const pattern = PATTERNS[patternId];

      const newPlayerData = structuredClone(player);
      newPlayerData.score += pattern.score;
      newPlayerData.board = replaceBoardPattern(player.board, pattern);
      this.updatePlayerData(newPlayerData);
    });
  }

  toggleCell(playerId: string, index: number) {
    this.doForPlayer(playerId, player => {
      const newPlayerData = structuredClone(player);
      newPlayerData.board = toggleCell(player.board, index);
      this.updatePlayerData(newPlayerData);
    });
  }

  updatePlayerOptions(playerId: string, options: PlayerDataOptions) {
    this.doForPlayer(playerId, player => {
      const newPlayerData = { ...player, options };
      this.updatePlayerData(newPlayerData);
    });
  }

  private doForPlayer(
    playerId: string,
    callback: (player: PlayerData, socket: AppSocket) => void
  ) {
    const player = this.data.players[playerId];
    const socket = this.sockets[playerId];
    if (!player || !socket) {
      throw new Error('Invalid player or socket.');
    }
    callback(player, socket);
  }

  private updatePlayerData(playerData: PlayerData) {
    const socket = this.sockets[playerData.id]!;

    this.data.players[playerData.id] = playerData;

    socket.emit('updated', playerData);
    this.broadcast('otherUpdated', playerData);
  }

  private broadcast<K extends keyof ServerToClientEvents>(
    event: K,
    ...args: Parameters<ServerToClientEvents[K]>
  ) {
    this.server.in(this.data.code).emit(event, ...args);
  }
}
