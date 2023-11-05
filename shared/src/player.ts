import { BoardData, createBoard } from './board.js';
import { getUuid } from './uuid.js';

export type AvatarName = 'ein' | 'nina' | 'cat' | 'cal';

export type PlayerData = {
  id: string;
  name: string;
  avatar: AvatarName;
  score: number;
  board: BoardData;
};

export type PlayerDataOptions = {
  name?: string;
  avatar?: AvatarName;
};

export function createPlayerData(options: PlayerDataOptions): PlayerData {
  return {
    id: getUuid(),
    name: options.name ?? 'Unnamed',
    avatar: options.avatar ?? 'cal',
    score: 0,
    board: createBoard(),
  };
}
