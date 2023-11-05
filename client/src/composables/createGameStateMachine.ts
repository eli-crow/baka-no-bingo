import {
  CellPatternId,
  PlayerData,
  PlayerDataOptions,
  RoomData,
} from '@shared';

import { InjectionKey, inject, provide, ref } from 'vue';
import { SocketState } from './createSocketState';

const GAME_STATE_INJECTION_KEY: InjectionKey<GameStateMachine> =
  Symbol('gameState');
const LOCAL_STORAGE_PLAYER_ID_KEY = 'playerId';

function getStoredPlayerId() {
  return localStorage.getItem(LOCAL_STORAGE_PLAYER_ID_KEY);
}

function setStoredPlayerId(playerId: string) {
  localStorage.setItem(LOCAL_STORAGE_PLAYER_ID_KEY, playerId);
}

function clearStoredPlayerId() {
  localStorage.removeItem(LOCAL_STORAGE_PLAYER_ID_KEY);
}

export function createGameStateMachine(socket: SocketState) {
  const state = ref<Readonly<GameState>>({ type: 'idle' });

  socket.on('joined', (playerData, roomData) => {
    if (state.value.type === 'joining') {
      setStoredPlayerId(playerData.id);
      state.value = {
        type: 'joined',
        room: roomData,
        player: playerData,
      };
    }
  });

  socket.on('otherJoined', data => {
    if (state.value.type === 'joined') {
      state.value = {
        ...state.value,
        room: {
          ...state.value.room,
          players: { ...state.value.room.players, [data.id]: data },
        },
      };
    }
  });

  socket.on('left', () => {
    clearStoredPlayerId();
    state.value = { type: 'left' };
  });

  socket.on('otherLeft', id => {
    if (state.value.type === 'joined') {
      const { [id]: _, ...players } = state.value.room.players;
      state.value = {
        ...state.value,
        room: { ...state.value.room, players },
      };
    }
  });

  socket.on('updated', data => {
    if (state.value.type === 'joined') {
      state.value = {
        ...state.value,
        player: data,
      };
    }
  });

  socket.on('otherUpdated', data => {
    if (state.value.type === 'joined') {
      state.value = {
        ...state.value,
        room: {
          ...state.value.room,
          players: { ...state.value.room.players, [data.id]: data },
        },
      };
    }
  });

  return {
    get state() {
      return state.value;
    },

    host(playerDataOptions: PlayerDataOptions) {
      if (state.value.type === 'idle') {
        socket.emit('host', playerDataOptions);
        state.value = { type: 'joining' };
      }
    },

    join(roomCode: RoomData['code'], playerDataOptions: PlayerDataOptions) {
      return new Promise<void>((resolve, reject) => {
        if (state.value.type === 'idle') {
          state.value = { type: 'joining' };
          socket.emit('join', roomCode, playerDataOptions, ack => {
            if ('success' in ack) {
              resolve();
            } else {
              reject(ack.error);
            }
          });
        }
      });
    },

    leave() {
      if (state.value.type === 'joined') {
        socket.emit('leave');
      }
    },

    updatePlayer(playerDataOptions: PlayerDataOptions) {
      if (state.value.type === 'joined') {
        socket.emit('updatePlayer', playerDataOptions);
      }
    },

    requestCell() {
      if (state.value.type !== 'joined') {
        socket.emit('requestCell');
      }
    },

    requestSellPattern(patternId: CellPatternId) {
      if (state.value.type !== 'joined') {
        socket.emit('sellPattern', patternId);
      }
    },

    resetBoard() {
      if (state.value.type !== 'joined') {
        socket.emit('resetBoard');
      }
    },
  };
}

export function provideGameStateMachine(stateMachine: GameStateMachine) {
  provide(GAME_STATE_INJECTION_KEY, stateMachine);
}

export function useGameStateMachine() {
  const stateMachine = inject(GAME_STATE_INJECTION_KEY);
  if (!stateMachine) {
    throw new Error(`${useGameStateMachine.name} called without a provider`);
  }
  return stateMachine;
}
type GameState =
  | {
      type: 'idle';
    }
  | {
      type: 'joining';
    }
  | {
      type: 'joined';
      room: RoomData;
      player: PlayerData;
    }
  | {
      type: 'left';
    };

export type GameStateMachine = ReturnType<typeof createGameStateMachine>;
