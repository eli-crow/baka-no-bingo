import localStorageService from '@/services/localStorageService';
import {
  CellPatternId,
  ClientGameAction,
  ClientGameData,
  PlayerData,
  PlayerDataOptions,
  RoomData,
  getMatchingPatternIds,
  getResolvedCells,
  nextClientGameState,
} from '@shared';
import { InjectionKey, computed, inject, provide, ref } from 'vue';
import { SocketState, useSocketState } from './createSocketState';

const GAME_STATE_INJECTION_KEY: InjectionKey<ClientGameState> =
  Symbol('gameState');

function createClientGameStateMachine() {
  let state: ClientGameData = { status: 'idle' };
  const reactiveState = ref<ClientGameData>(state);

  function send(action: ClientGameAction) {
    const newState = nextClientGameState(state, action);
    state = newState;
    reactiveState.value = newState;
  }

  return {
    send,
    get state() {
      return reactiveState.value;
    },
  };
}

export function createClientGameState(initialSocket?: SocketState) {
  const machine = createClientGameStateMachine();

  const socket = initialSocket ?? useSocketState();
  socket.on('otherJoined', player => {
    machine.send({ type: 'otherJoined', player });
  });

  socket.on('otherLeft', playerId => {
    machine.send({ type: 'otherLeft', playerId });
  });

  socket.on('playerUpdated', player => {
    machine.send({ type: 'playerUpdated', player });
  });

  const playersRankedByScore = computed(() => {
    if ('room' in machine.state) {
      return Object.values(machine.state.room.players).sort(
        (a, b) => b!.score - a!.score
      ) as PlayerData[];
    } else {
      return [];
    }
  });

  return {
    get status() {
      return machine.state.status;
    },

    get code() {
      if ('room' in machine.state) {
        return machine.state.room.code;
      } else {
        return '';
      }
    },

    get players() {
      if ('room' in machine.state) {
        return machine.state.room.players;
      } else {
        return null;
      }
    },

    get player() {
      if ('myPlayerId' in machine.state) {
        return machine.state.room.players[machine.state.myPlayerId]!;
      } else {
        return null;
      }
    },

    get cells() {
      if (this.player) {
        const { cells, selectedIndices } = this.player.board;
        return getResolvedCells(cells, selectedIndices);
      } else {
        return [];
      }
    },

    get sellablePatternIds() {
      if (this.player) {
        return getMatchingPatternIds(this.player.board.selectedIndices);
      } else {
        return [];
      }
    },

    get canReplace() {
      if (this.player) {
        return this.player.score >= 5;
      } else {
        return false;
      }
    },

    get canReset() {
      if (this.player) {
        return this.player.score >= 10;
      } else {
        return false;
      }
    },

    get playersRankedByScore() {
      return playersRankedByScore.value;
    },

    host(options?: PlayerDataOptions) {
      return new Promise<void>((resolve, reject) => {
        socket.emit('host', options, ack => {
          if (ack.success) {
            machine.send({
              type: 'joined',
              myPlayerId: ack.myPlayerId,
              room: ack.room,
            });
            localStorageService.playerId = ack.myPlayerId;
            localStorageService.roomCode = ack.room.code;
            resolve();
          } else {
            reject();
          }
        });
      });
    },

    join(code: RoomData['code'], options?: PlayerDataOptions) {
      return new Promise<void>((resolve, reject) => {
        socket.emit('join', code, options, ack => {
          if (ack.success) {
            machine.send({
              type: 'joined',
              myPlayerId: ack.myPlayerId,
              room: ack.room,
            });
            localStorageService.playerId = ack.myPlayerId;
            localStorageService.roomCode = ack.room.code;
            resolve();
          } else {
            reject();
          }
        });
      });
    },

    leave() {
      return new Promise<void>((resolve, reject) => {
        socket.emit('leave', ack => {
          if (ack.success) {
            resolve();
            delete localStorageService.playerId;
            delete localStorageService.roomCode;
          } else {
            reject();
          }
        });
      });
    },

    sellPattern(patternId: CellPatternId) {
      socket.emit('sellPattern', patternId);
    },

    toggleCell(index: number) {
      socket.emit('toggleCell', index);
    },
  };
}

export type ClientGameState = ReturnType<typeof createClientGameState>;

export function provideClientGameState(stateMachine: ClientGameState) {
  provide(GAME_STATE_INJECTION_KEY, stateMachine);
}

export function useClientGameState() {
  return inject(GAME_STATE_INJECTION_KEY)!;
}
