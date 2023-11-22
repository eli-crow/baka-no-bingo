import {
  AckResponse,
  GameNotFoundError,
  Player,
  PlayerNotFoundError,
  PlayerNotInGameError,
  PlayerOptions,
  ServerError,
  ServerGame,
  createPlayer,
  generateGameCode,
} from 'shared/src/index.js';
import { AppSocket, AppSocketEventName, AppSocketEventParameters, AppSocketServer } from '../types/socket.js';

type PlayerInfo = { playerId: Player['id']; gameCode: ServerGame['code'] };

export default class Coordinator {
  private games = new Map<ServerGame['code'], ServerGame>();
  private socketIdToPlayerInfo = new Map<AppSocket['id'], PlayerInfo>();

  private server: AppSocketServer;

  constructor(server: AppSocketServer) {
    this.server = server;

    this.server.on('connection', socket => {
      this.handleConnection(socket);
    });
  }

  private createGame(): ServerGame {
    const game = new ServerGame(this.generateRoomCode());
    const everyoneInGame = this.server.to(game.code);

    console.log(`Game ${game.code} created`);

    game.on('playerUpdated', player => {
      everyoneInGame.emit('playerUpdated', player);
    });

    game.on('manyPlayersUpdated', players => {
      everyoneInGame.emit('manyPlayersUpdated', players);
    });

    game.on('playerLeft', playerId => {
      everyoneInGame.emit('playerLeft', playerId);
    });

    game.on('patternSold', (playerId, patternId) => {
      everyoneInGame.emit('patternSold', playerId, patternId);
    });

    game.on('proposedCell', (playerId, cell) => {
      everyoneInGame.emit('proposedCell', playerId, cell);
    });

    game.on('proposedCellDenied', cellId => {
      this.server.in(game.code).emit('proposedCellDenied', cellId);
    });

    game.on('end', () => {
      console.log(`Game ${game.code} ended`);
      this.games.delete(game.code);
      this.socketIdToPlayerInfo.forEach((info, socketId) => {
        if (info.gameCode === game.code) {
          this.socketIdToPlayerInfo.delete(socketId);
        }
      });
    });

    this.games.set(game.code.toLowerCase(), game);

    return game;
  }

  private createPlayer(socketId: AppSocket['id'], game: ServerGame, playerOptions?: PlayerOptions): Player {
    const player = createPlayer(playerOptions);
    this.socketIdToPlayerInfo.set(socketId, {
      playerId: player.id,
      gameCode: game.code,
    });

    game.addPlayer(player);

    return player;
  }

  private handleConnection(socket: AppSocket) {
    socket.onAny((event, ...args) => {
      console.log(`[${socket.id}] ${event}`, ...args);
    });

    this.handle(socket, 'host', playerOptions => {
      const game = this.createGame();
      const player = this.createPlayer(socket.id, game, playerOptions);
      socket.join(game.code);
      return { success: true, myPlayerId: player.id, game: game.getData() };
    });

    this.handle(socket, 'join', (code, playerOptions) => {
      const game = this.tryGetGame(code);
      const player = this.createPlayer(socket.id, game, playerOptions);
      socket.join(game.code);
      return { success: true, myPlayerId: player.id, game: game.getData() };
    });

    this.handle(socket, 'rejoin', (gameCode, playerId) => {
      const game = this.tryGetGame(gameCode);
      const player = game.tryGetPlayer(playerId);

      socket.join(gameCode);
      this.socketIdToPlayerInfo.set(socket.id, {
        playerId: player.id,
        gameCode: game.code,
      });

      game.clearPlayerDisconnecting(playerId);

      return { success: true, myPlayerId: player.id, game: game.getData() };
    });

    this.handleWithPlayerInfo(
      socket,
      'disconnect',
      (playerId, game) => {
        game.markPlayerDisconnecting(playerId);
        this.socketIdToPlayerInfo.delete(socket.id);
      },
      true
    );

    this.handleWithPlayerInfo(socket, 'leave', (playerId, game) => {
      game.removePlayer(playerId);
      socket.leave(game.code);
      this.socketIdToPlayerInfo.delete(socket.id);
    });

    this.handleWithPlayerInfo(socket, 'sellPattern', (playerId, game, patternId) => {
      game.sellPattern(playerId, patternId);
    });

    this.handleWithPlayerInfo(socket, 'toggleCell', (playerId, game, index) => {
      game.toggleCell(playerId, index);
    });

    this.handleWithPlayerInfo(socket, 'denyProposedCell', (playerId, game, cellId) => {
      game.denyCell(cellId);
    });
  }

  private handle<E extends AppSocketEventName>(
    socket: AppSocket,
    event: E,
    handler: (...args: AppSocketEventParameters<E>) => void | AckResponse,
    failSilently = false
  ) {
    // @ts-expect-error - complex typing!
    socket.on(event, (...originalArgs: AppSocketEventParameters<E>) => {
      const lastArg = originalArgs[originalArgs.length - 1];
      const ack = typeof lastArg === 'function' ? lastArg : undefined;

      try {
        const response = handler(...originalArgs);

        if (response) {
          ack?.(response);
        } else {
          ack?.({ success: true });
        }
      } catch (e) {
        if (failSilently) return;

        if (e instanceof ServerError) {
          ack?.({ success: false, error: e.constructor.name });
        } else {
          throw e;
        }
      }
    });
  }

  private handleWithPlayerInfo<E extends AppSocketEventName>(
    socket: AppSocket,
    event: E,
    handler: (playerId: Player['id'], game: ServerGame, ...args: AppSocketEventParameters<E>) => void | AckResponse,
    failSilently = false
  ) {
    // @ts-expect-error - complex typing!
    socket.on(event, (...originalArgs: AppSocketEventParameters<E>) => {
      const lastArg = originalArgs[originalArgs.length - 1];
      const ack = typeof lastArg === 'function' ? lastArg : undefined;

      try {
        const playerInfo = this.socketIdToPlayerInfo.get(socket.id);
        if (!playerInfo) {
          throw new PlayerNotFoundError();
        }

        const playerId = playerInfo.playerId;
        const game = this.tryGetGame(playerInfo.gameCode);

        if (!game) {
          throw new GameNotFoundError();
        }

        if (!game.hasPlayer(playerInfo.playerId)) {
          throw new PlayerNotInGameError();
        }

        const response = handler(playerId, game, ...originalArgs);

        if (response) {
          ack?.(response);
        } else {
          ack?.({ success: true });
        }
      } catch (e) {
        if (failSilently) return;

        if (e instanceof ServerError) {
          ack?.({ success: false, error: e.constructor.name });
        } else {
          throw e;
        }
      }
    });
  }

  private tryGetGame(code: string): ServerGame {
    const game = this.games.get(code);
    if (!game) throw new GameNotFoundError();
    return game;
  }

  private generateRoomCode(): string {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const code = generateGameCode();

      if (this.games.has(code)) {
        continue;
      }

      return code;
    }
  }
}
