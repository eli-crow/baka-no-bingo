import localStorageService from '@/services/localStorageService';
import {
  CellPatternId,
  ClientGame,
  ClientGameAction,
  PlayerData,
  PlayerDataOptions,
  RoomData,
  getMatchingPatternIds,
  getResolvedCells,
  nextClientGame,
} from '@shared';
import { InjectionKey, computed, inject, provide, ref } from 'vue';
import { SocketState } from './createSocketState';

const GAME_STATE_INJECTION_KEY: InjectionKey<ClientGameState> =
  Symbol('gameState');

function createClientGameStateMachine() {
  const initial: ClientGame = { status: 'idle' };
  let state: ClientGame = initial;
  const reactiveState = ref<ClientGame>(initial);

  function send(action: ClientGameAction) {
    const newState = nextClientGame(state, action);
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

export function createClientGameState(socket: SocketState) {
  const machine = createClientGameStateMachine();

  socket.on('otherJoined', player => {
    machine.send({ type: 'otherJoined', player });
  });

  socket.on('otherLeft', playerId => {
    machine.send({ type: 'otherLeft', playerId });
  });

  socket.on('playerUpdated', player => {
    machine.send({ type: 'playerUpdated', player });
  });

  function _join(myPlayerId: PlayerData['id'], room: RoomData) {
    machine.send({ type: 'joined', myPlayerId, room });
    localStorageService.playerId = myPlayerId;
    localStorageService.roomCode = room.code;
  }

  function _leave() {
    delete localStorageService.playerId;
    delete localStorageService.roomCode;
  }

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

    get canJoin() {
      return this.status === 'idle';
    },

    get canHost() {
      return this.status === 'idle';
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

    rejoin(myPlayerId: PlayerData['id'], roomCode: RoomData['code']) {
      return new Promise<void>((resolve, reject) => {
        machine.send({ type: 'rejoining' });

        socket.emit('rejoin', myPlayerId, roomCode, ack => {
          if (ack.success) {
            _join(ack.myPlayerId, ack.room);
            resolve();
          } else {
            machine.send({ type: 'reset' });
            reject();
          }
        });
      });
    },

    host(options?: PlayerDataOptions) {
      return new Promise<void>((resolve, reject) => {
        socket.emit('host', options, ack => {
          if (ack.success) {
            _join(ack.myPlayerId, ack.room);
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
            _join(ack.myPlayerId, ack.room);
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
            _leave();
            resolve();
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
