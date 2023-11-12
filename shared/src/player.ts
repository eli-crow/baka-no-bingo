import { BoardData, createBoard } from './board.js';
import { getUuid } from './uuid.js';

export const AVATAR_NAMES = ['ein', 'nina', 'cat', 'cal'] as const;

export type AvatarName = (typeof AVATAR_NAMES)[number];

export type Player = {
  id: string;
  name: string;
  avatar: AvatarName;
  score: number;
  board: BoardData;
};

export type PlayerOptions = {
  name?: string;
  avatar?: AvatarName;
};

export function createPlayer({
  name = 'Anonymous',
  avatar = 'cal',
}: PlayerOptions = {}): Player {
  return {
    id: getUuid(),
    name,
    avatar,
    score: 0,
    board: createBoard(),
  };
}
