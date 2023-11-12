import tropes from './tropes.json' assert { type: 'json' };

const ALL_TROPES = Object.entries(tropes).map(
  ([id, text]) => <TropeCell>{ type: 'trope', id, text }
);

type TropeCell = {
  type: 'trope';
  id: string;
  text: string;
};

type FreeCell = {
  type: 'free';
};

export type Cell = TropeCell | FreeCell;

export type BoardData = {
  cells: Cell[];
  selectedIndices: number[];
};

export function getRandomTropeCells(count: number) {
  ALL_TROPES.sort(() => Math.random() - 0.5);
  return ALL_TROPES.slice(0, count);
}

export function createBoard(): BoardData {
  const tropeCells = getRandomTropeCells(8);
  const freeIndex = 4;
  return {
    cells: [
      ...tropeCells.slice(0, freeIndex),
      { type: 'free' },
      ...tropeCells.slice(freeIndex),
    ],
    selectedIndices: [freeIndex],
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

export const CELL_PATTERNS: Record<CellPatternId, CellPattern> = {
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

  const replacements = getRandomTropeCells(pattern.indices.length);

  const newSelectedIndices = new Set(newBoard.selectedIndices);
  pattern.indices.forEach(cellIndex => {
    newBoard.cells[cellIndex] = replacements.pop()!;
    newSelectedIndices.delete(cellIndex);
  });

  newBoard.cells[4] = { type: 'free' };
  newSelectedIndices.add(4);

  newBoard.selectedIndices = Array.from(newSelectedIndices);

  return newBoard;
}

export function toggleCell(board: BoardData, index: number): BoardData {
  const freeIndex = 4;
  if (index === freeIndex) {
    return board;
  }

  const newBoard = structuredClone(board);
  const selected = newBoard.selectedIndices.includes(index);
  if (selected) {
    newBoard.selectedIndices = newBoard.selectedIndices.filter(
      i => i !== index
    );
  } else {
    newBoard.selectedIndices.push(index);
  }

  return newBoard;
}

export function matchesPatternId(
  selectedIndices: readonly number[],
  patternId: CellPatternId
): boolean {
  return CELL_PATTERNS[patternId].indices.every(i =>
    selectedIndices.includes(i)
  );
}

export function getMatchingPatternIds(
  selectedIndices: readonly number[]
): CellPatternId[] {
  return CELL_PATTERN_IDS.filter(id => matchesPatternId(selectedIndices, id));
}

export function getResolvedCells(
  cells: readonly Cell[],
  selectedIndices: readonly number[]
): ResolvedCell[] {
  return cells.map((cell, index) => ({
    ...cell,
    selected: selectedIndices.includes(index),
    key: index,
  }));
}

export type ResolvedCell = Cell & {
  selected: boolean;
  key: number;
};
