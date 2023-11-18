import tropes from './tropes.json' assert { type: 'json' };
import { getUuid } from './uuid.js';

const ALL_TROPE_DEFINITIONS: readonly TropeDefinition[] = Object.entries(
  tropes
).map(([id, text]) => <TropeCell>{ id, text });

type TropeDefinition = {
  id: string;
  text: string;
};

type BaseCell<T extends string> = {
  type: T;
  key: string;
};

export type TropeCell = BaseCell<'trope'> & {
  id: string;
  text: string;
};

export type FreeCell = BaseCell<'free'>;

export type Cell = TropeCell | FreeCell;

export function createTropeCell(tropeDefinition: TropeDefinition): TropeCell {
  const key = getUuid();
  return {
    type: 'trope',
    key,
    id: tropeDefinition.id,
    text: tropeDefinition.text,
  };
}

export function createFreeCell(): FreeCell {
  const key = getUuid();
  return {
    type: 'free',
    key,
  };
}

export function getRandomTropeCell(): TropeCell {
  const index = Math.floor(Math.random() * ALL_TROPE_DEFINITIONS.length);
  return createTropeCell(ALL_TROPE_DEFINITIONS[index]);
}

export function getRandomTropeCells(count: number) {
  const cells: TropeCell[] = [];
  const cellIds = new Set<string>();
  while (cells.length < count) {
    const cell = getRandomTropeCell();
    if (!cellIds.has(cell.id)) {
      cells.push(cell);
      cellIds.add(cell.id);
    }
  }
  return cells;
}

export function getResolvedCells(
  cells: readonly Cell[],
  selectedIndices: readonly number[]
): ResolvedCell[] {
  return cells.map((cell, index) => ({
    ...cell,
    selected: selectedIndices.includes(index),
  }));
}

export type ResolvedCell = Cell & {
  selected: boolean;
  key: string;
};
