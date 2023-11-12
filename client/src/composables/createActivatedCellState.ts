import { Cell, Player } from '@shared';
import { ref } from 'vue';
import { useClientGameState } from './createClientGameState';
import { useSocketState } from './createSocketState';

const SHOW_FOR_DURATION_MS = 8_000;

type ActivatedCellInfo = {
  cell: Cell;
  playerId: Player['id'];
};

export function createActivatedCellState() {
  const socket = useSocketState();
  const game = useClientGameState();

  const info = ref<ActivatedCellInfo | null>(null);
  let timeout: number | null = null;

  function showCell(id: Player['id'], c: Cell) {
    if (timeout) {
      clearTimeout(timeout);
    }
    info.value = {
      playerId: id,
      cell: c,
    };
    timeout = setTimeout(() => {
      info.value = null;
      timeout = null;
    }, SHOW_FOR_DURATION_MS);
  }

  socket.on('playerActivatedCell', (playerId: string, cell: Cell) => {
    if (playerId === game.myPlayerId) {
      return;
    }
    showCell(playerId, cell);
  });

  return {
    get cell() {
      return info.value?.cell ?? null;
    },
    get player() {
      if (info.value) {
        return game.players?.[info.value.playerId] ?? null;
      } else {
        return null;
      }
    },
  };
}
