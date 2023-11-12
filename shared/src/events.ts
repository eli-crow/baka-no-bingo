import { GameData } from './ServerGame';
import { Cell, CellPatternId } from './board';
import { Player, PlayerOptions } from './player';

export interface ServerToClientEvents {
  playerJoined(otherPlayerData: Player): void;
  playerLeft(playerId: string): void;
  playerUpdated(otherPlayerData: Player): void;
  playerActivatedCell(playerId: string, cell: Cell): void;
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
}
