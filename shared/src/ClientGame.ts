import { Player } from './Player.js';
import type { GameData } from './ServerGame.js';
import { produce } from './immutable.js';

export type ClientGame =
  | {
      readonly status: 'idle';
    }
  | {
      readonly status: 'rejoining';
    }
  | {
      readonly status: 'playing';
      readonly game: GameData;
      readonly myPlayerId: Player['id'];
    };

export type ClientGameAction =
  | { type: 'rejoining' }
  | { type: 'reset' }
  | { type: 'leave' }
  | { type: 'joined'; game: GameData; myPlayerId: Player['id'] }
  | { type: 'updated'; player: Player }
  | { type: 'playerJoined'; player: Player }
  | { type: 'playerLeft'; playerId: string }
  | { type: 'playerUpdated'; player: Player };

// prettier-ignore
export function nextClientGame(
  state: ClientGame,
  action: ClientGameAction
): ClientGame {
  if ('idle' === state.status) {
    if ('joined' === action.type) {
      return {
        status: 'playing',
        game: action.game,
        myPlayerId: action.myPlayerId,
      };
    } 
    
    else if ('rejoining' === action.type) {
      return { status: 'rejoining' };
    }
  }

  else if ('rejoining' === state.status) {
    if ('joined' === action.type) {
      return {
        status: 'playing',
        game: action.game,
        myPlayerId: action.myPlayerId,
      };
    } 
    
    else if ('reset' === action.type) {
      return { status: 'idle' };
    }
  }

  else if ('playing' === state.status) {
    if ('playerJoined' === action.type) {
      return produce(state, draft => {
        draft.game.players[action.player.id] === action.player;
      });
    } 
    
    else if ('playerLeft' === action.type) {
      return produce(state, draft => {
        delete draft.game.players[action.playerId];
      });
    } 
    
    else if ('playerUpdated' === action.type) {
      return produce(state, draft => {
        draft.game.players[action.player.id] = action.player;
      });
    } 
    
    else if ('reset' === action.type) {
      return { status: 'idle' };
    } 
    
    else if ('leave' === action.type) {
      return { status: 'idle' };
    }
  }

  return state;
}
