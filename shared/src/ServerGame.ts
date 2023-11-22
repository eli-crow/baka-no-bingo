import { replaceBoardPattern } from './Board.js';
import { TropeCell } from './Cell.js';
import { CELL_PATTERNS, CellPatternId, matchesPatternId } from './CellPattern.js';
import { ActionNotAllowedError, PlayerNotFoundError } from './errors/index.js';
import { Player } from './Player.js';

export type GameData = {
  readonly code: string;
  readonly players: {
    [playerId: Player['id']]: Player | undefined;
  };
};

export type ServerGameEvents = {
  playerUpdated(player: Player): void;
  manyPlayersUpdated(players: Player[]): void;
  playerLeft(playerId: Player['id']): void;
  proposedCell(playerId: Player['id'], cell: TropeCell): void;
  proposedCellDenied(cellId: TropeCell['id']): void;
  patternSold(playerId: Player['id'], patternId: CellPatternId): void;
  end(): void;
};

const DISCONNECTION_TIMEOUT_MS = 10_000;
const END_TIMEOUT_MS = 5_000;

export class ServerGame {
  readonly code: string;
  private readonly players = new Map<Player['id'], Player>();
  private readonly disconnectingPlayers = new Map<Player['id'], NodeJS.Timeout>();
  private endTimeout: NodeJS.Timeout | null = null;

  private readonly listeners: {
    [E in keyof ServerGameEvents]: Set<ServerGameEvents[E]>;
  } = {
    playerLeft: new Set(),
    playerUpdated: new Set(),
    proposedCell: new Set(),
    proposedCellDenied: new Set(),
    manyPlayersUpdated: new Set(),
    patternSold: new Set(),
    end: new Set(),
  };

  constructor(code: string) {
    this.code = code;
  }

  addPlayer(player: Player) {
    this.players.set(player.id, player);
    this.emit('playerUpdated', player);

    if (this.endTimeout) {
      clearTimeout(this.endTimeout);
      this.endTimeout = null;
    }
  }

  removePlayer(playerId: Player['id']) {
    this.players.delete(playerId);
    this.emit('playerLeft', playerId);

    if (this.players.size === 0) {
      this.endTimeout = setTimeout(() => {
        this.emit('end');
      }, END_TIMEOUT_MS);
    }
  }

  markPlayerDisconnecting(playerId: Player['id']) {
    const timeout = setTimeout(() => {
      this.disconnectingPlayers.delete(playerId);
      this.removePlayer(playerId);
    }, DISCONNECTION_TIMEOUT_MS);
    this.disconnectingPlayers.set(playerId, timeout);
  }

  clearPlayerDisconnecting(playerId: Player['id']) {
    const timeout = this.disconnectingPlayers.get(playerId);
    if (timeout) {
      clearTimeout(timeout);
      this.disconnectingPlayers.delete(playerId);
    }
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
      this.emit('patternSold', playerId, patternId);
    } else {
      throw new ActionNotAllowedError();
    }
  }

  toggleCell(playerId: string, cellIndex: number) {
    const player = this.tryGetPlayer(playerId);

    if (cellIndex === 4) {
      return;
    }

    let proposedCell: TropeCell | null = null;
    const indexOfSelected = player.board.selectedIndices.indexOf(cellIndex);
    if (indexOfSelected !== -1) {
      player.board.selectedIndices.splice(indexOfSelected, 1);
    } else {
      player.board.selectedIndices.push(cellIndex);
      const cell = player.board.cells[cellIndex];
      if (cell.type === 'trope') {
        proposedCell = cell;
      }
    }

    this.emit('playerUpdated', player);
    if (proposedCell) {
      this.emit('proposedCell', playerId, proposedCell);
    }
  }

  denyCell(cellId: TropeCell['id']) {
    const updatedPlayers: Player[] = [];
    for (const player of this.players.values()) {
      const indexOfSelected = player.board.selectedIndices.indexOf(
        player.board.cells.findIndex(cell => cell.type === 'trope' && cell.id === cellId)
      );
      if (indexOfSelected !== -1) {
        player.board.selectedIndices.splice(indexOfSelected, 1);
        updatedPlayers.push(player);
      }
    }

    this.emit('manyPlayersUpdated', updatedPlayers);
    this.emit('proposedCellDenied', cellId);
  }

  getData(): GameData {
    return {
      code: this.code,
      players: Object.fromEntries(this.players),
    };
  }

  on<T extends keyof ServerGameEvents>(event: T, listener: ServerGameEvents[T]) {
    this.listeners[event].add(listener);
  }

  off<T extends keyof ServerGameEvents>(event: T, listener: ServerGameEvents[T]) {
    this.listeners[event].delete(listener);
  }

  private emit<T extends keyof ServerGameEvents>(event: T, ...args: Parameters<ServerGameEvents[T]>) {
    const set = this.listeners[event];
    for (const listener of set) {
      // @ts-expect-error - the arguments are guaranteed to match from the function signature
      listener(...args);
    }
  }

  public tryGetPlayer(playerId: string) {
    const player = this.players.get(playerId);
    if (!player) throw new PlayerNotFoundError();
    return player;
  }
}
