import { PlayerData } from './player';
import { RoomData } from './room';

export type ClientGame =
  | {
      readonly status: 'idle';
    }
  | {
      readonly status: 'rejoining';
    }
  | {
      readonly status: 'playing';
      readonly room: RoomData;
      readonly myPlayerId: PlayerData['id'];
    };

export type ClientGameAction =
  | { type: 'rejoining' }
  | { type: 'reset' }
  | { type: 'joined'; room: RoomData; myPlayerId: PlayerData['id'] }
  | { type: 'updated'; player: PlayerData }
  | { type: 'otherJoined'; player: PlayerData }
  | { type: 'otherLeft'; playerId: string }
  | { type: 'playerUpdated'; player: PlayerData };

export function nextClientGame(
  state: ClientGame,
  action: ClientGameAction
): ClientGame {
  // player has not yet joined a room
  if ('idle' === state.status) {
    if ('joined' === action.type) {
      return {
        status: 'playing',
        room: action.room,
        myPlayerId: action.myPlayerId,
      };
    } else if ('rejoining' === action.type) {
      return {
        status: 'rejoining',
      };
    }
  }

  // player is attempting to rejoin a room
  if ('rejoining' === state.status) {
    if ('joined' === action.type) {
      return {
        status: 'playing',
        room: action.room,
        myPlayerId: action.myPlayerId,
      };
    } else if ('reset' === action.type) {
      return {
        status: 'idle',
      };
    }
  }

  // player has joined a room
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

  return state;
}

type MutableClientGame<G extends ClientGame> = {
  -readonly [K in keyof G]: G[K];
} & {
  type: G['status'];
};

function produce<G extends ClientGame>(
  state: G,
  modifier: (draft: MutableClientGame<G>) => void
): G {
  const draft = structuredClone(state) as MutableClientGame<G>;
  modifier(draft);
  return draft;
}
