import { Series } from 'shared/src/anime/Series.js';
import { crSeriesToSeries, getAllCRSeries } from './CRSeries.js';

export async function getRandomSeriesSample(size: number): Promise<Series[]> {
  const crSeries = await getAllCRSeries();

  const series: Series[] = [];
  const seriesIndices = new Set<number>();
  while (series.length < size) {
    const randomIndex = Math.floor(Math.random() * crSeries.length);
    if (!seriesIndices.has(randomIndex)) {
      series.push(crSeriesToSeries(crSeries[randomIndex]));
      seriesIndices.add(randomIndex);
    }
  }

  return series;
}
