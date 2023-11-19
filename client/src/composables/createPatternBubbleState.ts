import crossUrl from '@/assets/images/pattern/cross.svg';
import plusUrl from '@/assets/images/pattern/plus.svg';
import slashHUrl from '@/assets/images/pattern/slash-h.svg';
import slashNeSwUrl from '@/assets/images/pattern/slash-ne-sw.svg';
import slashNwSeUrl from '@/assets/images/pattern/slash-nw-se.svg';
import slashVUrl from '@/assets/images/pattern/slash-v.svg';
import { CellPatternId, Player } from '@shared';
import { ref } from 'vue';
import { useSocketState } from './createSocketState';

const SHOW_DURATION_MS = 1000;
const CELL_PATTERN_ID_TO_SRC: Record<CellPatternId, string> = {
  column1: slashVUrl,
  column2: slashVUrl,
  column3: slashVUrl,
  all: slashHUrl,
  row1: slashHUrl,
  row2: slashHUrl,
  row3: slashHUrl,
  diagonal1: slashNwSeUrl,
  diagonal2: slashNeSwUrl,
  plus: plusUrl,
  x: crossUrl,
};

type PatternBubble = {
  key: number;
  src: string;
};

export default function createPatternBubbleState(
  showForPlayerId: Player['id']
) {
  const socket = useSocketState();

  const bubble = ref<PatternBubble | null>(null);

  let timeout: number | null = null;
  let keys = 0;

  function show(patternId: CellPatternId) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }

    bubble.value = {
      key: keys++,
      src: CELL_PATTERN_ID_TO_SRC[patternId],
    };

    timeout = setTimeout(() => {
      bubble.value = null;
      timeout = null;
    }, SHOW_DURATION_MS);
  }

  socket.on('patternSold', (playerId, patternId) => {
    console.log('pattern sold', playerId, showForPlayerId, patternId);
    if (playerId === showForPlayerId) {
      show(patternId);
    }
  });

  return {
    get data() {
      return bubble.value;
    },
  };
}
