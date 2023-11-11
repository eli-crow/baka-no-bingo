import { BoardData } from './board';
import { PlayerData } from './player';
import { RoomData } from './room';

export type ClientGameData =
  | {
      readonly status: 'idle';
    }
  | {
      readonly status: 'playing';
      readonly room: RoomData;
      readonly myPlayerId: PlayerData['id'];
    }
  | {
      readonly status: 'pendingBoard';
      readonly room: RoomData;
      readonly pendingBoard: BoardData;
      readonly myPlayerId: PlayerData['id'];
    };

export type ClientGameAction =
  | { type: 'joined'; room: RoomData; myPlayerId: PlayerData['id'] }
  | { type: 'updated'; player: PlayerData }
  | { type: 'otherJoined'; player: PlayerData }
  | { type: 'otherLeft'; playerId: string }
  | { type: 'playerUpdated'; player: PlayerData };

export function nextClientGameState(
  state: ClientGameData,
  action: ClientGameAction
): ClientGameData {
  // the player has not yet joined a room
  if ('idle' === state.status) {
    if ('joined' === action.type) {
      return {
        status: 'playing',
        room: action.room,
        myPlayerId: action.myPlayerId,
      };
    }
  }

  // player has joined a room and their board is in a confirmed state
  else if ('playing' === state.status) {
    if ('otherJoined' === action.type) {
      return produce(state, draft => {
        draft.room.players[action.player.id] === action.player;
      });
    } else if ('otherLeft' === action.type) {
      return produce(state, draft => {
        delete draft.room.players[action.playerId];
      });
    } else if ('playerUpdated' === action.type) {
      return produce(state, draft => {
        draft.room.players[action.player.id] = action.player;
      });
    }
  }

  // player has joined a room and their board is in an optimisitc state, awaiting confirmation from the server
  else if ('pendingBoard' === state.status) {
    if ('updated' === action.type) {
      return {
        status: 'playing',
        room: state.room,
        myPlayerId: action.player.id,
      };
    }
  }

  return state;
}

type MutableClientGameState<G extends ClientGameData> = {
  -readonly [K in keyof G]: G[K];
} & {
  type: G['status'];
};

function produce<G extends ClientGameData>(
  state: G,
  modifier: (draft: MutableClientGameState<G>) => void
): G {
  const draft = structuredClone(state) as MutableClientGameState<G>;
  modifier(draft);
  return draft;
}
