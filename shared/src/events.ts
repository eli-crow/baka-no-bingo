import { TropeCell } from './Cell.js';
import { CellPatternId } from './CellPattern.js';
import { Player, PlayerOptions } from './Player.js';
import { GameData } from './ServerGame.js';
import { ServerErrorName } from './errors/index.js';

export interface ServerToClientEvents {
  playerJoined(otherPlayerData: Player): void;
  playerLeft(playerId: string): void;
  playerUpdated(otherPlayerData: Player): void;
  manyPlayersUpdated(players: Player[]): void;
  proposedCell(playerId: string, cell: TropeCell): void;
  proposedCellDenied(cellId: TropeCell['id']): void;
  patternSold(playerId: string, patternId: CellPatternId): void;
}

type ClientGameInit = {
  myPlayerId: Player['id'];
  game: GameData;
};

export interface ClientToServerEvents {
  host(playerDataOptions: PlayerOptions | undefined, ack?: Ack<ClientGameInit>): void;
  join(roomCode: GameData['code'], playerDataOptions: PlayerOptions | undefined, ack?: Ack<ClientGameInit>): void;
  rejoin(roomCode: GameData['code'], myPlayerId: Player['id'], ack?: Ack<ClientGameInit>): void;

  leave(ack?: Ack): void;
  sellPattern(patternId: CellPatternId, ack?: Ack): void;
  toggleCell(index: number, ack?: Ack): void;
  denyProposedCell(cellId: TropeCell['id']): void;
}

type Payload = { [key: string]: unknown } | void;

export type AckResponse<P extends Payload = void> =
  | ({ success: true } & P)
  | { success: false; error: ServerErrorName };

type Ack<P extends Payload = void> = (response: AckResponse<P>) => void;
