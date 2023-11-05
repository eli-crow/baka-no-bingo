import { CellPatternId } from './board';
import { PlayerData, PlayerDataOptions } from './player';
import { RoomData } from './room';

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
    ack?: (payload: { error: string } | { success: true }) => void
  ): void;
  leave(): void;
  updatePlayer(options: PlayerDataOptions): void;
  requestCell(): void;
  resetBoard(): void;
  sellPattern(patternId: CellPatternId): void;
}
