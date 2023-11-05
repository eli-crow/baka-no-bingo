import { BoardData, Cell, getMatchingPatternIds } from '@shared';
import { InjectionKey, computed, inject, provide, reactive } from 'vue';

const BOARD_STATE_INJECTION_KEY: InjectionKey<BoardState> =
  Symbol('boardState');

export function createBoardState(board: BoardData) {
  const selectedStatefulCells = reactive<Set<number>>(new Set([]));

  const resolvedCells = computed(() => {
    const statefulCells = board.cells;
    const resolvedStatefulCells = statefulCells.map((cell, index) => {
      return <ResolvedCell>{
        ...cell,
        selected: selectedStatefulCells.has(index),
        key: cell.id,
      };
    });

    const cells: ResolvedCell[] = [
      ...resolvedStatefulCells.slice(0, 4),
      { type: 'free', selected: true, key: 'free' },
      ...resolvedStatefulCells.slice(4, 8),
    ];

    return cells;
  });

  const sellablePatternIds = computed(() => {
    const selectedResolvedIndices = resolvedCells.value
      .map((cell, index) => (cell.selected ? index : null))
      .filter((value): value is number => value !== null);

    return getMatchingPatternIds(selectedResolvedIndices);
  });

  return {
    get cells() {
      return resolvedCells.value;
    },

    get sellablePatternIds() {
      return sellablePatternIds.value;
    },

    toggleCell(resolvedIndex: number) {
      const statefulIndex =
        resolvedIndex < 4 ? resolvedIndex : resolvedIndex - 1;
      const selected = selectedStatefulCells.has(statefulIndex);
      if (selected) {
        selectedStatefulCells.delete(statefulIndex);
      } else {
        selectedStatefulCells.add(statefulIndex);
      }
    },
  } as const;
}

export function provideBoardState(board: BoardData) {
  provide(BOARD_STATE_INJECTION_KEY, createBoardState(board));
}

export function useBoardState() {
  const boardState = inject(BOARD_STATE_INJECTION_KEY);
  if (!boardState) {
    throw new Error(`${useBoardState.name} called without a provider`);
  }
  return boardState;
}

type BoardState = ReturnType<typeof createBoardState>;

export type ResolvedCell = Cell & {
  selected: boolean;
  key: any;
};
