import { AvatarName, Board, Player, TropeCell } from '@shared';
import { ref } from 'vue';
import { useClientGameState } from './createClientGameState';
import { useSocketState } from './createSocketState';

const SHOW_CELL_DURATION_MS = 15_000;
const SHOW_BAKA_DURATION_MS = 3_000;

type ProposedCellInfo = {
  text: string;
  avatar: AvatarName;
  cellId: TropeCell['id'];
  board: Board;
};

export type BakaBubble = { x: number; y: number; rotation: string };

export function createProposedCellState() {
  const socket = useSocketState();
  const game = useClientGameState();

  const info = ref<ProposedCellInfo | null>(null);
  const bakaPosition = ref<BakaBubble | null>(null);
  let proposedCellTimeout: number | null = null;
  let bakaTimeout: number | null = null;

  function hideCell() {
    if (proposedCellTimeout) {
      clearTimeout(proposedCellTimeout);
    }
    info.value = null;
    proposedCellTimeout = null;
  }

  function showCell(playerId: Player['id'], cell: TropeCell) {
    if (proposedCellTimeout) {
      clearTimeout(proposedCellTimeout);
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

    proposedCellTimeout = setTimeout(() => {
      info.value = null;
      proposedCellTimeout = null;
    }, SHOW_CELL_DURATION_MS);
  }

  function showBaka() {
    if (bakaTimeout) {
      clearTimeout(bakaTimeout);
    }
    bakaPosition.value = {
      x: Math.random(),
      y: Math.random(),
      rotation: `${Math.round(-15 + Math.random() * 30)}deg`,
    };
    bakaTimeout = setTimeout(() => {
      bakaPosition.value = null;
      bakaTimeout = null;
    }, SHOW_BAKA_DURATION_MS);
  }

  socket.on('proposedCell', (playerId, cell) => {
    if (playerId === game.myPlayerId) {
      return;
    }
    showCell(playerId, cell);
  });

  socket.on('proposedCellDenied', cellId => {
    if (info.value?.cellId === cellId) {
      hideCell();
    }

    const isOtherPlayersCell = game.player?.board.cells.some(
      c => c.type === 'trope' && c.id === cellId
    );
    if (isOtherPlayersCell) {
      showBaka();
    }
  });

  return {
    get info() {
      return info.value;
    },
    get baka() {
      return bakaPosition.value;
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
