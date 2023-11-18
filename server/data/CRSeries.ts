import { parse } from 'csv-parse/sync';
import { readFile } from 'fs/promises';
import path from 'path';
import { Series } from 'shared/src/anime/Series.js';

const __dirname = new URL('.', import.meta.url).pathname;

const DATASET_PATH = path.join(__dirname, 'series.csv');
const API_SERIES_URL = 'https://www.crunchyroll.com/series/';

type CRAudioLocale = 'ja-JP' | 'en-US';
type CRSubtitleLocale = 'ja-JP' | 'en-US';

export type CRSeries = {
  is_simulcast: boolean;
  episode_count: number;
  audio_locales: CRAudioLocale[];
  title: string;
  keywords: string[];
  subtitle_locales: CRSubtitleLocale[];
  description: string;
  content_provider: string;
  is_dubbed: boolean;
  series_launch_year: number;
  is_mature: boolean;
  is_subbed: boolean;
  id: string;
  season_count: number;
  maturity_ratings: string;
  average: number;
  total: number;
  star1s_displayed: number;
  star1s_unit: string | null;
  star1s_percentage: number | null;
  star2s_displayed: number;
  star2s_unit: string | null;
  star2s_percentage: number | null;
  star3s_displayed: number;
  star3s_unit: string | null;
  star3s_percentage: number | null;
  star4s_displayed: number;
  star4s_unit: string | null;
  star4s_percentage: number | null;
  star5s_displayed: number;
  star5s_unit: string | null;
  star5s_percentage: number | null;
  season_tags: string | null;
};

export function crSeriesToSeries(crSeries: CRSeries): Series {
  const sourceURL = `${API_SERIES_URL}${crSeries.id}`;
  return {
    id: crSeries.id,
    title: crSeries.title,
    description: crSeries.description,
    tags: crSeries.keywords,
    sources: [
      {
        url: sourceURL,
        provider: 'crunchyroll',
      },
    ],
  };
}

export async function getAllCRSeries(): Promise<CRSeries[]> {
  const fileText = await readFile(DATASET_PATH, 'utf-8');
  const entries = parse(fileText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return entries.map(
    (raw: { [column: string]: string | number | boolean | null }) => ({
      is_simulcast: raw.is_simulcast,
      episode_count: raw.episode_count,
      audio_locales:
        typeof raw.audio_locales === 'string'
          ? raw.audio_locales.split(/\s*,\s*/g)
          : [],
      title: raw.title,
      keywords:
        typeof raw.keywords === 'string' ? raw.keywords.split(/\s*,\s*/g) : [],
      subtitle_locales:
        typeof raw.subtitle_locales === 'string'
          ? raw.subtitle_locales.split(/\s*,\s*/g)
          : [],
      description: raw.description,
      content_provider: raw.content_provider,
      is_dubbed: raw.is_dubbed,
      series_launch_year: raw.series_launch_year,
      is_mature: raw.is_mature,
      is_subbed: raw.is_subbed,
      id: raw.id,
      season_count: raw.season_count,
      maturity_ratings: raw.maturity_ratings,
      average: raw.average,
      total: raw.total,
      star1s_displayed: raw['1s_displayed'],
      star1s_unit: raw['1s_unit'],
      star1s_percentage: raw['1s_percentage'],
      star2s_displayed: raw['2s_displayed'],
      star2s_unit: raw['2s_unit'],
      star2s_percentage: raw['2s_percentage'],
      star3s_displayed: raw['3s_displayed'],
      star3s_unit: raw['3s_unit'],
      star3s_percentage: raw['3s_percentage'],
      star4s_displayed: raw['4s_displayed'],
      star4s_unit: raw['4s_unit'],
      star4s_percentage: raw['4s_percentage'],
      star5s_displayed: raw['5s_displayed'],
      star5s_unit: raw['5s_unit'],
      star5s_percentage: raw['5s_percentage'],
      season_tags:
        typeof raw.season_tags === 'string'
          ? raw.season_tags.split(/\s*,\s*/g)
          : [],
    })
  );
}
