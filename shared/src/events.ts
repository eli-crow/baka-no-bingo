import { CellPatternId } from './board';
import { PlayerData, PlayerDataOptions } from './player';
import { RoomData } from './room';

type Ack<E extends string = 'unknown'> = (
  payload:
    | {
        success: false;
        error: E;
        message: string;
      }
    | { success: true }
) => void;

export interface ServerToClientEvents {
  joined(playerData: PlayerData, roomData: RoomData): void;
  otherJoined(otherPlayerData: PlayerData): void;
  left(): void;
  otherLeft(otherPlayerId: string): void;
  updated(myData: PlayerData): void;
  otherUpdated(otherPlayerData: PlayerData): void;
}

export interface ClientToServerEvents {
  host(playerDataOptions: PlayerDataOptions): void;
  join(
    roomCode: RoomData['code'],
    playerDataOptions: PlayerDataOptions,
    ack?: Ack<'noroom'>
  ): void;
  leave(): void;
  updatePlayer(options: PlayerDataOptions): void;
  requestCell(): void;
  resetBoard(): void;
  sellPattern(patternId: CellPatternId, ack?: Ack<'cant' | 'noroom'>): void;
  toggleCell(index: number): void;
  getRandomCell(): void;
}
