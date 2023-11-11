import { CellPatternId } from './board';
import { PlayerData, PlayerDataOptions } from './player';
import { RoomData } from './room';

export interface ServerToClientEvents {
  otherJoined(otherPlayerData: PlayerData): void;
  otherLeft(otherPlayerId: string): void;
  playerUpdated(otherPlayerData: PlayerData): void;
}

export interface ClientToServerEvents {
  host(
    playerDataOptions: PlayerDataOptions | undefined,
    ack?: (
      response:
        | { success: true; myPlayerId: PlayerData['id']; room: RoomData }
        | { success: false }
    ) => void
  ): void;

  join(
    roomCode: RoomData['code'],
    playerDataOptions: PlayerDataOptions | undefined,
    ack?: (
      response:
        | { success: true; myPlayerId: PlayerData['id']; room: RoomData }
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
