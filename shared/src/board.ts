import tropes from './tropes.json' assert { type: 'json' };

const ALL_TROPES = Object.entries(tropes).map(
  ([id, text]) => <TropeCell>{ type: 'trope', id, text }
);

export type TropeCell = {
  type: 'trope';
  id: string;
  text: string;
};

export type FreeCell = {
  type: 'free';
};

export type StatefulCell = TropeCell;

export type Cell = TropeCell | FreeCell;

export type BoardData = {
  cells: StatefulCell[];
};

export function getRandomTropeCells(count: number) {
  ALL_TROPES.sort(() => Math.random() - 0.5);
  return ALL_TROPES.slice(0, count);
}

export function getRandomTropeCell() {
  return ALL_TROPES[Math.floor(Math.random() * ALL_TROPES.length)];
}

export function createBoard(): BoardData {
  return {
    cells: getRandomTropeCells(8),
  };
}

export const CELL_PATTERN_IDS = [
  'all',
  'x',
  'plus',
  'row1',
  'row2',
  'row3',
  'column1',
  'column2',
  'column3',
  'diagonal1',
  'diagonal2',
] as const;

export type CellPatternId = (typeof CELL_PATTERN_IDS)[number];

export type CellPattern = {
  indices: readonly number[];
  score: number;
  name: string;
};

export const PATTERNS: Record<CellPatternId, CellPattern> = {
  all: {
    indices: [0, 1, 2, 3, 4, 5, 6, 7, 8],
    score: 250,
    name: 'Baka no Bingo',
  },
  x: { indices: [0, 2, 4, 6, 8], score: 100, name: 'Ekkusu' },
  plus: { indices: [1, 3, 4, 5, 7], score: 100, name: 'Purasu' },
  row1: { indices: [0, 1, 2], score: 50, name: 'Hashi' },
  row2: { indices: [3, 4, 5], score: 20, name: 'Kiru' },
  row3: { indices: [6, 7, 8], score: 50, name: 'Hashi' },
  column1: { indices: [0, 3, 6], score: 50, name: 'Hashi' },
  column2: { indices: [1, 4, 7], score: 20, name: 'Kiru' },
  column3: { indices: [2, 5, 8], score: 50, name: 'Hashi' },
  diagonal1: { indices: [0, 4, 8], score: 20, name: 'Kiru' },
  diagonal2: { indices: [2, 4, 6], score: 20, name: 'Kiru' },
};

export function replaceBoardPattern(
  board: BoardData,
  pattern: CellPattern
): BoardData {
  const newBoard = structuredClone(board);

  pattern.indices.forEach(i => {
    if (i === 4) {
      return;
    } else if (i < 4) {
      newBoard.cells[i] = getRandomTropeCell();
    } else {
      newBoard.cells[i - 1] = getRandomTropeCell();
    }
  });

  return newBoard;
}

export function getMatchingPatternIds(
  activeCellIndices: readonly number[]
): CellPatternId[] {
  return CELL_PATTERN_IDS.filter(id => {
    const pattern = PATTERNS[id];
    return pattern.indices.every(i => activeCellIndices.includes(i));
  });
}
