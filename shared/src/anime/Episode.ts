export type AnimeType = 'TV' | 'MOVIE' | 'OVA' | 'ONA' | 'SPECIAL' | 'UNKNOWN';
export type AnimeStatus = 'FINISHED' | 'ONGOING' | 'UPCOMING' | 'UNKNOWN';
export type AnimeSeasonType = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' | 'UNDEFINED';

export interface AnimeSeason {
  season: AnimeSeasonType;
  year?: number;
}

export interface Anime {
  sources: string[];
  title: string;
  type: AnimeType;
  episodes: number;
  status: AnimeStatus;
  animeSeason: AnimeSeason;
  picture: string;
  thumbnail: string;
  synonyms: string[];
  relations: string[];
  tags: string[];
}

export interface License {
  name: string;
  url: string;
}

export interface Root {
  license: License;
  repository: string;
  lastUpdate: string;
  data: Anime[];
}