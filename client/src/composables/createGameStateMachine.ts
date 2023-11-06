import {
  CellPatternId,
  PlayerData,
  PlayerDataOptions,
  RoomData,
  getMatchingPatternIds,
  getResolvedCells,
} from '@shared';

import { InjectionKey, computed, inject, provide, reactive, ref } from 'vue';
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
  const clearCallbacks = reactive<Set<() => void>>(new Set());

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

  const resolvedCells = computed(() => {
    if (state.value.type !== 'joined') {
      return [];
    }

    const { cells, selectedIndices } = state.value.player.board;

    return getResolvedCells(cells, selectedIndices);
  });

  const sellablePatternIds = computed(() => {
    if (state.value.type !== 'joined') {
      return [];
    }

    return getMatchingPatternIds(state.value.player.board.selectedIndices);
  });

  return {
    get state() {
      return state.value;
    },

    get cells() {
      return resolvedCells.value;
    },

    get sellablePatternIds() {
      return sellablePatternIds.value;
    },

    host(playerDataOptions: PlayerDataOptions) {
      if (state.value.type !== 'idle') {
        return;
      }

      socket.emit('host', playerDataOptions);
      state.value = { type: 'joining' };
    },

    join(roomCode: RoomData['code'], playerDataOptions: PlayerDataOptions) {
      return new Promise<void>((resolve, reject) => {
        if (state.value.type !== 'idle') {
          resolve();
          return;
        }

        state.value = { type: 'joining' };
        socket.emit('join', roomCode, playerDataOptions, ack => {
          if (ack.success) {
            resolve();
          } else {
            reject(ack.message ?? `Error: ${ack.error}`);
          }
        });
      });
    },

    leave() {
      if (state.value.type !== 'joined') {
        return;
      }
      socket.emit('leave');
    },

    updatePlayer(playerDataOptions: PlayerDataOptions) {
      if (state.value.type !== 'joined') {
        return;
      }
      socket.emit('updatePlayer', playerDataOptions);
    },

    toggleCell(index: number) {
      if (state.value.type !== 'joined') {
        return;
      }
      socket.emit('toggleCell', index);
    },

    getRandomCell() {
      if (state.value.type !== 'joined') {
        return;
      }
      socket.emit('getRandomCell');
    },

    requestSellPattern(patternId: CellPatternId) {
      // TODO: move selected stateful cells to PlayerData board state
      return new Promise<void>((resolve, reject) => {
        if (state.value.type !== 'joined') {
          resolve();
          return;
        }

        socket.emit('sellPattern', patternId, ack => {
          if (ack.success) {
            clearCallbacks.forEach(cb => cb());
            resolve();
          } else {
            reject(ack.message ?? `Error: ${ack.error}`);
          }
        });
      });
    },

    resetBoard() {
      if (state.value.type === 'joined') {
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
