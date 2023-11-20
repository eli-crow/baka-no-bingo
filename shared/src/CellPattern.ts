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
    score: 500,
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
