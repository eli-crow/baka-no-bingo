import { BoardData, createBoard } from './board.js';
import { getUuid } from './uuid.js';

export const AVATAR_NAMES = ['ein', 'nina', 'cat', 'cal'] as const;

export type AvatarName = (typeof AVATAR_NAMES)[number];

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
