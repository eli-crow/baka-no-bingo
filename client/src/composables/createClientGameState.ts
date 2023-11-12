import localStorageService from '@/services/storage';
import {
  CellPatternId,
  ClientGame,
  ClientGameAction,
  GameData,
  Player,
  PlayerOptions,
  ServerGame,
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

  return {
    get state() {
      return reactiveState.value;
    },

    send(action: ClientGameAction) {
      const newState = nextClientGame(state, action);
      state = newState;
      reactiveState.value = newState;
    },
  };
}

export function createClientGameState(socket: SocketState) {
  const machine = createClientGameStateMachine();

  socket.on('playerJoined', player => {
    machine.send({ type: 'playerJoined', player });
  });

  socket.on('playerLeft', playerId => {
    machine.send({ type: 'playerLeft', playerId });
  });

  socket.on('playerUpdated', player => {
    machine.send({ type: 'playerUpdated', player });
  });

  socket.on('manyPlayersUpdated', players => {
    for (const player of players) {
      machine.send({ type: 'playerUpdated', player });
    }
  });

  function _join(myPlayerId: Player['id'], game: GameData) {
    machine.send({ type: 'joined', myPlayerId, game });
    localStorageService.playerId = myPlayerId;
    localStorageService.gameCode = game.code;
  }

  function _leave() {
    machine.send({ type: 'leave' });
    delete localStorageService.playerId;
    delete localStorageService.gameCode;
  }

  const playersRankedByScore = computed(() => {
    if ('game' in machine.state) {
      return Object.values(machine.state.game.players).sort(
        (a, b) => b!.score - a!.score
      ) as Player[];
    } else {
      return [];
    }
  });

  return {
    get status() {
      return machine.state.status;
    },

    get code() {
      if ('game' in machine.state) {
        return machine.state.game.code;
      } else {
        return '';
      }
    },

    get players() {
      if ('game' in machine.state) {
        return machine.state.game.players;
      } else {
        return null;
      }
    },

    get player() {
      if ('myPlayerId' in machine.state) {
        return machine.state.game.players[machine.state.myPlayerId]!;
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

    get myPlayerId() {
      if ('myPlayerId' in machine.state) {
        return machine.state.myPlayerId;
      } else {
        return null;
      }
    },

    rejoin(myPlayerId: Player['id'], gameCode: ServerGame['code']) {
      return new Promise<void>((resolve, reject) => {
        machine.send({ type: 'rejoining' });

        socket.emit('rejoin', myPlayerId, gameCode, ack => {
          if (ack.success) {
            _join(ack.myPlayerId, ack.game);
            resolve();
          } else {
            machine.send({ type: 'reset' });
            reject();
          }
        });
      });
    },

    host(options?: PlayerOptions) {
      return new Promise<void>((resolve, reject) => {
        socket.emit('host', options, ack => {
          if (ack.success) {
            _join(ack.myPlayerId, ack.game);
            resolve();
          } else {
            reject();
          }
        });
      });
    },

    join(code: ServerGame['code'], options?: PlayerOptions) {
      return new Promise<void>((resolve, reject) => {
        socket.emit('join', code, options, ack => {
          if (ack.success) {
            _join(ack.myPlayerId, ack.game);
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
