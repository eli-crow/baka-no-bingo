import { ServerGame } from '../../shared/src/ServerGame.js';
import { generateGameCode } from '../../shared/src/code.js';
import {
  ActionNotAllowedError,
  PlayerNotFoundError,
  RoomNotFoundError,
} from '../../shared/src/errors.js';
import {
  Player,
  PlayerOptions,
  createPlayer,
} from '../../shared/src/player.js';
import { AppSocket, AppSocketServer } from './type.js';

export default class Coordinator {
  private games = new Map<ServerGame['code'], ServerGame>();
  private socketIdToPlayerInfo = new Map<
    AppSocket['id'],
    { playerId: Player['id']; gameCode: ServerGame['code'] }
  >();

  private server: AppSocketServer;

  constructor(server: AppSocketServer) {
    this.server = server;

    this.server.on('connection', socket => {
      this.handleConnection(socket);
    });
  }

  private createGame(): ServerGame {
    const game = new ServerGame(this.generateRoomCode());
    game.on('playerUpdated', player => {
      this.server.to(game.code).emit('playerUpdated', player);
    });
    game.on('playerLeft', playerId => {
      this.server.to(game.code).emit('playerLeft', playerId);
      if (game.isEmpty) {
        this.games.delete(game.code);
        this.socketIdToPlayerInfo.forEach((info, socketId) => {
          if (info.gameCode === game.code) {
            this.socketIdToPlayerInfo.delete(socketId);
          }
        });
      }
    });
    this.games.set(game.code.toLowerCase(), game);
    return game;
  }

  private createPlayer(
    socketId: AppSocket['id'],
    game: ServerGame,
    playerOptions?: PlayerOptions
  ): Player {
    const player = createPlayer(playerOptions);
    this.socketIdToPlayerInfo.set(socketId, {
      playerId: player.id,
      gameCode: game.code,
    });

    game.addPlayer(player);

    return player;
  }

  private handleConnection(socket: AppSocket) {
    // TODO: handle disconnect

    socket.on('host', (playerOptions, ack) => {
      try {
        const game = this.createGame();
        const player = this.createPlayer(socket.id, game, playerOptions);
        socket.join(game.code);
        ack?.({
          success: true,
          myPlayerId: player.id,
          game: game.getData(),
        });
      } catch (e) {
        ack?.({ success: false });
      }
    });

    socket.on('join', (code, playerOptions, ack) => {
      const game = this.getGame(code);
      if (!game) return ack?.({ success: false });

      const player = this.createPlayer(socket.id, game, playerOptions);
      socket.join(game.code);

      ack?.({
        success: true,
        myPlayerId: player.id,
        game: game.getData(),
      });
    });

    socket.on('rejoin', (playerId, code, ack) => {
      // TODO: prevent if socket.id already has a player?
      const game = this.getGame(code);
      if (!game || !game.hasPlayer(playerId)) return ack?.({ success: false });

      socket.join(game.code);

      this.socketIdToPlayerInfo.set(socket.id, {
        playerId: playerId,
        gameCode: game.code,
      });

      ack?.({
        success: true,
        myPlayerId: playerId,
        game: game.getData(),
      });
    });

    socket.on('leave', ack => {
      try {
        const { playerId, game } = this.tryGetInfo(socket.id);
        game.removePlayer(playerId);
        socket.leave(game.code);
        this.socketIdToPlayerInfo.delete(socket.id);
        ack?.({ success: true });
      } catch (e) {
        ack?.({ success: false });
      }
    });

    socket.on('sellPattern', (patternId, ack) => {
      try {
        const { playerId, game } = this.tryGetInfo(socket.id);
        game.sellPattern(playerId, patternId);
        ack?.({ success: true });
      } catch (e) {
        if (e instanceof ActionNotAllowedError) {
          ack?.({ success: false, error: 'cant' });
        } else {
          ack?.({ success: false, error: 'noroom' });
        }
      }
    });

    socket.on('toggleCell', (index, ack) => {
      try {
        const { playerId, game } = this.tryGetInfo(socket.id);
        game.toggleCell(playerId, index);
        ack?.({ success: true });
      } catch (e) {
        ack?.({ success: false });
      }
    });
  }

  private tryGetInfo(socketId: AppSocket['id']) {
    const playerInfo = this.socketIdToPlayerInfo.get(socketId);
    if (!playerInfo) throw new PlayerNotFoundError();

    const { playerId, gameCode } = playerInfo;
    const game = this.getGame(gameCode);
    if (!game) throw new RoomNotFoundError();

    return { playerId, game };
  }

  private getGame(code: string): ServerGame {
    return this.games.get(code)!;
  }

  private generateRoomCode(): string {
    while (true) {
      const code = generateGameCode();

      if (this.games.has(code)) {
        continue;
      }

      return code;
    }
  }
}
