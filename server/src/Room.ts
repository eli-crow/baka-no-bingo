import {
  CellPatternId,
  PATTERNS,
  PlayerData,
  PlayerDataOptions,
  RoomData,
  createPlayerData,
  createRoomData,
  replaceBoardPattern,
  toggleCell,
} from '../../shared/src/index.js';
import { AppSocket, AppSocketServer } from './type.js';

export class Room {
  private _data: RoomData;
  get data() {
    return this._data;
  }

  private sockets: { [playerId: string]: AppSocket | undefined } = {};

  constructor(
    code: string,
    private server: AppSocketServer
  ) {
    this._data = createRoomData(code);
  }

  addPlayer(socket: AppSocket, options?: PlayerDataOptions) {
    const playerData = createPlayerData(options);

    this.sockets[playerData.id] = socket;
    this._data.players[playerData.id] = playerData;

    socket.join(this._data.code);
    socket.broadcast.in(this._data.code).emit('otherJoined', playerData);

    return playerData;
  }

  removePlayer(id: string) {
    delete this.sockets[id];
    delete this._data.players[id];

    const socket = this.sockets[id];

    if (!socket) {
      return;
    }

    socket.leave(this._data.code);

    socket.broadcast.in(this._data.code).emit('otherLeft', id);
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
    const player = this._data.players[playerId];
    const socket = this.sockets[playerId];
    if (!player || !socket) {
      throw new Error('Invalid player or socket.');
    }
    callback(player, socket);
  }

  private updatePlayerData(playerData: PlayerData) {
    this._data.players[playerData.id] = playerData;
    this.server.in(this._data.code).emit('playerUpdated', playerData);
  }
}
