import { Series } from '@shared';

import { useQuery } from '@tanstack/vue-query';
import { ref } from 'vue';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const API_ENDPINT = `${API_BASE_URL}/random-episodes`;
const SPIN_REPEAT_COUNT = 12;
const SPIN_INTERVAL_MS = 300;

const SPINNING_STRINGS = [
  'Deciding your fate…',
  'You asked for this…',
  "You're in my hands now…",
  'Ruining your night…',
  'This is legally binding…',
  "You can't escape…",
  "You're stuck with this…",
  "I'm sorry…",
  'You did this to yourself…',
  'You will regret this…',
  'Anime gazes back…',
] as const;

async function fetchSeries(): Promise<Series[]> {
  const response = await fetch(API_ENDPINT);
  const series = (await response.json()) as Series[];
  return series;
}

export function createAnimeRouletteState() {
  const status = ref<AnimeRouletteStatus>({ type: 'idle' });
  let spinInterval: number | null = null;

  const seriesQuery = useQuery({
    queryKey: ['random-episodes'],
    queryFn: fetchSeries,
    enabled: false,
  });

  function spin(candidates: readonly Series[]) {
    if (status.value.type === 'fetching' || status.value.type === 'stopped') {
      let spinCount = 0;
      const message =
        SPINNING_STRINGS[Math.floor(Math.random() * SPINNING_STRINGS.length)];

      status.value = {
        type: 'spinning',
        message,
        candidates,
        candidateIndex: 0,
      };

      if (spinInterval !== null) {
        clearInterval(spinInterval);
      }

      spinInterval = setInterval(() => {
        const candidateIndex = spinCount % candidates.length;
        spinCount += 1;

        status.value = {
          type: 'spinning',
          message,
          candidates,
          candidateIndex,
        };

        if (spinCount >= SPIN_REPEAT_COUNT) {
          if (spinInterval !== null) {
            clearInterval(spinInterval);
          }
          spinInterval = null;
          spinCount = 0;
          status.value = {
            type: 'stopped',
            candidates,
            candidateIndex,
          };
        }
      }, SPIN_INTERVAL_MS);
    }
  }

  function fetch() {
    if (status.value.type === 'idle') {
      status.value = { type: 'fetching' };
      console.log('fetching');
      seriesQuery.refetch().then(result => {
        if (result.isSuccess) {
          spin(result.data);
        } else {
          status.value = {
            type: 'idle',
            errorMessage: result.error?.message,
          };
        }
      });
    }
  }

  function start() {
    if (status.value.type === 'idle') {
      fetch();
    } else if (status.value.type === 'stopped') {
      spin(status.value.candidates);
    }
  }

  return {
    get status() {
      return status.value;
    },
    get canSpin() {
      return status.value.type === 'stopped' || status.value.type === 'idle';
    },
    get thumbnailSrc() {
      if (status.value.type === 'stopped' || status.value.type === 'spinning') {
        return status.value.candidates[status.value.candidateIndex].sources[0]
          ?.url;
      } else {
        return '';
      }
    },
    get series() {
      if (status.value.type === 'stopped' || status.value.type === 'spinning') {
        return status.value.candidates[status.value.candidateIndex];
      } else {
        return null;
      }
    },
    get spinActionText() {
      if (status.value.type === 'stopped') {
        return 'Spin again';
      } else if (status.value.type === 'idle') {
        return 'Spin';
      } else if (status.value.type === 'fetching') {
        return 'Fetching anime';
      } else {
        return status.value.message;
      }
    },
    start,
  };
}

type AnimeRouletteStatus =
  | {
      type: 'idle';
      errorMessage?: string;
    }
  | {
      type: 'fetching';
    }
  | {
      type: 'spinning';
      candidates: readonly Series[];
      candidateIndex: number;
      message: string;
    }
  | {
      type: 'stopped';
      candidates: readonly Series[];
      candidateIndex: number;
    };
