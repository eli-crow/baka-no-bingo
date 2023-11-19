import { TropeCell } from './Cell.js';
import { CellPatternId } from './CellPattern.js';
import { Player, PlayerOptions } from './Player.js';
import { GameData } from './ServerGame.js';

export interface ServerToClientEvents {
  playerJoined(otherPlayerData: Player): void;
  playerLeft(playerId: string): void;
  playerUpdated(otherPlayerData: Player): void;
  manyPlayersUpdated(players: Player[]): void;
  proposedCell(playerId: string, cell: TropeCell): void;
  proposedCellDenied(cellId: TropeCell['id']): void;
  patternSold(playerId: string, patternId: CellPatternId): void;
}

export interface ClientToServerEvents {
  host(
    playerDataOptions: PlayerOptions | undefined,
    ack?: (
      response:
        | { success: true; myPlayerId: Player['id']; game: GameData }
        | { success: false }
    ) => void
  ): void;

  join(
    roomCode: GameData['code'],
    playerDataOptions: PlayerOptions | undefined,
    ack?: (
      response:
        | { success: true; myPlayerId: Player['id']; game: GameData }
        | { success: false }
    ) => void
  ): void;

  rejoin(
    roomCode: GameData['code'],
    myPlayerId: Player['id'],
    ack?: (
      response:
        | { success: true; myPlayerId: Player['id']; game: GameData }
        | { success: false }
    ) => void
  ): void;

  leave(ack?: (response: { success: boolean }) => void): void;

  sellPattern(
    patternId: CellPatternId,
    // ack?: Ack<void, 'cant' | 'noroom'>
    ack?: (
      response: { success: true } | { success: false; error: 'cant' | 'noroom' }
    ) => void
  ): void;

  toggleCell(
    index: number,
    ack?: (response: { success: boolean }) => void
  ): void;

  denyProposedCell(cellId: TropeCell['id']): void;
}
