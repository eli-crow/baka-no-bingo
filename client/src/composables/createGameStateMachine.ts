import {
  CellPatternId,
  ClientToServerEvents,
  PlayerData,
  PlayerDataOptions,
  RoomData,
  ServerToClientEvents,
} from '@shared';
import { Socket, io as createSocket } from 'socket.io-client';
import { InjectionKey, inject, provide, ref } from 'vue';

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

export function createGameStateMachine() {
  const socket: Socket<ServerToClientEvents, ClientToServerEvents> =
    createSocket(import.meta.env.VITE_WEBSOCKET_URL);

  const state = ref<Readonly<GameState>>({ type: 'idle', connected: false });

  socket.on('connect', () => {
    if (state.value.type === 'disconnected') {
      state.value = {
        type: 'joined',
        room: state.value.room,
        player: state.value.player,
        connected: true,
      };
    } else if (state.value.type === 'idle') {
      state.value = { type: 'idle', connected: true };
    }
  });

  socket.on('disconnect', () => {
    if (state.value.type == 'joined') {
      state.value = {
        type: 'disconnected',
        room: state.value.room,
        player: state.value.player,
        connected: false,
      };
    } else if (state.value.type === 'idle') {
      state.value = { type: 'idle', connected: false };
    }
  });

  socket.on('joined', (playerData, roomData) => {
    if (state.value.type === 'idle') {
      setStoredPlayerId(playerData.id);
      state.value = {
        type: 'joined',
        room: roomData,
        player: playerData,
        connected: true,
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
    state.value = { type: 'idle', connected: state.value.connected };
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
      }
    },

    join(roomCode: RoomData['code'], playerDataOptions: PlayerDataOptions) {
      if (state.value.type === 'idle') {
        socket.emit('join', roomCode, playerDataOptions);
      }
    },

    leave() {
      if (state.value.type !== 'idle') {
        socket.emit('leave');
      }
    },

    updatePlayer(playerDataOptions: PlayerDataOptions) {
      if (state.value.type !== 'idle') {
        socket.emit('updatePlayer', playerDataOptions);
      }
    },

    requestCell() {
      if (state.value.type !== 'idle') {
        socket.emit('requestCell');
      }
    },

    requestSellPattern(patternId: CellPatternId) {
      if (state.value.type !== 'idle') {
        socket.emit('sellPattern', patternId);
      }
    },

    resetBoard() {
      if (state.value.type !== 'idle') {
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
      connected: boolean;
    }
  | {
      type: 'disconnected';
      room: RoomData;
      player: PlayerData;
      connected: false;
    }
  | {
      type: 'joined';
      room: RoomData;
      player: PlayerData;
      connected: true;
    };

export type GameStateMachine = ReturnType<typeof createGameStateMachine>;
