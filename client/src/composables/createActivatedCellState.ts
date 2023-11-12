import { AvatarName, Board, Player, TropeCell } from '@shared';
import { ref } from 'vue';
import { useClientGameState } from './createClientGameState';
import { useSocketState } from './createSocketState';

const SHOW_FOR_DURATION_MS = 15_000;

type ProposedCellInfo = {
  text: string;
  avatar: AvatarName;
  cellId: TropeCell['id'];
  board: Board;
};

export function createProposedCellState() {
  const socket = useSocketState();
  const game = useClientGameState();

  const info = ref<ProposedCellInfo | null>(null);
  let timeout: number | null = null;

  function hideCell() {
    if (timeout) {
      clearTimeout(timeout);
    }
    info.value = null;
    timeout = null;
  }

  function showCell(playerId: Player['id'], cell: TropeCell) {
    if (timeout) {
      clearTimeout(timeout);
    }

    const player = game.players?.[playerId];

    if (player) {
      info.value = {
        text: cell.text,
        avatar: player.avatar,
        board: player.board,
        cellId: cell.id,
      };
    } else {
      info.value = null;
    }

    timeout = setTimeout(() => {
      info.value = null;
      timeout = null;
    }, SHOW_FOR_DURATION_MS);
  }

  socket.on('proposedCell', (playerId, cell) => {
    if (playerId === game.myPlayerId) {
      return;
    }
    showCell(playerId, cell);
  });

  socket.on('proposedCellDenied', cellId => {
    console.log('denied', cellId, info.value?.cellId);
    if (info.value?.cellId === cellId) {
      hideCell();
    }

    // if the current player has it, show an alert saying "Baka!"
    if (
      game.player?.board.cells.some(c => c.type === 'trope' && c.id === cellId)
    ) {
      alert('Baka!');
    }
  });

  return {
    get info() {
      return info.value;
    },
    accept() {
      hideCell();
    },
    deny() {
      if (info.value) {
        socket.emit('denyProposedCell', info.value.cellId);
      }
    },
  };
}
