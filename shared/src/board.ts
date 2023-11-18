import { Cell, createFreeCell, getRandomTropeCells } from './Cell.js';
import { CellPattern } from './CellPattern.js';

export type Board = {
  cells: Cell[];
  selectedIndices: number[];
};

export function createBoard(): Board {
  const tropeCells = getRandomTropeCells(8);
  const freeIndex = 4;
  return {
    cells: [
      ...tropeCells.slice(0, freeIndex),
      createFreeCell(),
      ...tropeCells.slice(freeIndex),
    ],
    selectedIndices: [freeIndex],
  };
}

export function replaceBoardPattern(board: Board, pattern: CellPattern): Board {
  const newBoard = structuredClone(board);

  const replacements = getRandomTropeCells(pattern.indices.length);

  const newSelectedIndices = new Set(newBoard.selectedIndices);
  pattern.indices.forEach(cellIndex => {
    newBoard.cells[cellIndex] = replacements.pop()!;
    newSelectedIndices.delete(cellIndex);
  });

  newBoard.cells[4] = createFreeCell();
  newSelectedIndices.add(4);

  newBoard.selectedIndices = Array.from(newSelectedIndices);

  return newBoard;
}
