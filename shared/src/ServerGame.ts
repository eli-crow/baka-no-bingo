import {
  CELL_PATTERNS,
  Cell,
  CellPatternId,
  matchesPatternId,
  replaceBoardPattern,
} from './board.js';
import { ActionNotAllowedError, PlayerNotFoundError } from './errors.js';
import { Player } from './player.js';

export type GameData = {
  readonly code: string;
  readonly players: {
    [playerId: Player['id']]: Player | undefined;
  };
};

export type ServerGameEvents = {
  playerUpdated(player: Player): void;
  playerLeft(playerId: Player['id']): void;
  playerActivatedCell(playerId: Player['id'], cell: Cell): void;
};

export class ServerGame {
  readonly code: string;
  private readonly players = new Map<Player['id'], Player>();

  get isEmpty() {
    return this.players.size === 0;
  }

  private readonly listeners: {
    [E in keyof ServerGameEvents]: Set<ServerGameEvents[E]>;
  } = {
    playerLeft: new Set(),
    playerUpdated: new Set(),
    playerActivatedCell: new Set(),
  };

  constructor(code: string) {
    this.code = code;
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player);
    this.emit('playerUpdated', player);
  }

  removePlayer(playerId: Player['id']) {
    this.players.delete(playerId);
    this.emit('playerLeft', playerId);
  }

  hasPlayer(playerId: Player['id']) {
    return this.players.has(playerId);
  }

  sellPattern(playerId: string, patternId: CellPatternId) {
    const player = this.tryGetPlayer(playerId);
    if (matchesPatternId(player.board.selectedIndices, patternId)) {
      const pattern = CELL_PATTERNS[patternId];
      player.score += pattern.score;
      player.board = replaceBoardPattern(player.board, pattern);
      this.emit('playerUpdated', player);
    } else {
      throw new ActionNotAllowedError();
    }
  }

  toggleCell(playerId: string, cellIndex: number) {
    const player = this.tryGetPlayer(playerId);

    if (cellIndex === 4) {
      return;
    }

    const indexOfSelected = player.board.selectedIndices.indexOf(cellIndex);
    if (indexOfSelected !== -1) {
      player.board.selectedIndices.splice(indexOfSelected, 1);
    } else {
      player.board.selectedIndices.push(cellIndex);
      const cell = player.board.cells[cellIndex];
      this.emit('playerActivatedCell', playerId, cell);
    }

    this.emit('playerUpdated', player);
  }

  getData(): GameData {
    return {
      code: this.code,
      players: Object.fromEntries(this.players),
    };
  }

  on<T extends keyof ServerGameEvents>(
    event: T,
    listener: ServerGameEvents[T]
  ) {
    this.listeners[event].add(listener);
  }

  off<T extends keyof ServerGameEvents>(
    event: T,
    listener: ServerGameEvents[T]
  ) {
    this.listeners[event].delete(listener);
  }

  private emit<T extends keyof ServerGameEvents>(
    event: T,
    ...args: Parameters<ServerGameEvents[T]>
  ) {
    const set = this.listeners[event];
    for (const listener of set) {
      // @ts-ignore
      listener(...args);
    }
  }

  private tryGetPlayer(playerId: string) {
    const player = this.players.get(playerId);
    if (!player) throw new PlayerNotFoundError();
    return player;
  }
}
