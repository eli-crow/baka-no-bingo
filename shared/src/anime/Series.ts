export type SeriesProvider = 'crunchyroll';

export type SeriesSource = {
  provider: SeriesProvider;
  url: string;
};

export type Series = {
  id: string;
  title: string;
  description?: string;
  sources: readonly SeriesSource[];
  tags: string[];
};
