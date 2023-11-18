import { Anime, Root } from '../../shared/src/Episode.js';
import episodes from './anime.json' assert { type: 'json' };

export function getRandomEpisode(): Anime {
  const root = episodes as Root;
  const count = root.data.length;
  const randomIndex = Math.floor(Math.random() * count);
  return root.data[randomIndex];
}
