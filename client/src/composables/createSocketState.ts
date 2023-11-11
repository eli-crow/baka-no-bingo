import { ClientToServerEvents, ServerToClientEvents } from '@shared';

import { Socket, io as createSocket } from 'socket.io-client';
import { InjectionKey, inject, onUnmounted, provide, ref } from 'vue';

const SOCKET_STATE_INJECTION_KEY: InjectionKey<SocketState> =
  Symbol('socketState');

const RECONNECTION_DELAY = 1_000;
const RECONNECTION_DURATION_MAX = 10_000;

export type SocketState = {
  readonly socket: AppSocket;
  readonly firstConnection: Promise<void>;
  readonly isConnected: boolean;
  readonly on: AppSocket['on'];
  readonly emit: AppSocket['emit'];
};

export function createSocketState(): SocketState {
  const socket: AppSocket = createSocket(import.meta.env.VITE_WEBSOCKET_URL, {
    reconnectionDelay: RECONNECTION_DELAY,
    reconnectionDelayMax: RECONNECTION_DURATION_MAX,
  });

  const isConnected = ref(false);

  if (import.meta.env.DEV) {
    socket.onAny((event, ...args) => {
      console.log(event, args);
    });
  }

  const firstConnection = new Promise<void>(resolve => {
    socket.once('connect', resolve);
  });

  socket.on('connect', () => {
    isConnected.value = true;
  });

  socket.on('disconnect', () => {
    isConnected.value = false;
  });

  onUnmounted(() => {
    socket.disconnect();
  });

  const emit: AppSocket['emit'] = (event, ...args) => {
    if (import.meta.env.DEV) {
      console.log('--->', event, args);
    }
    socket.emit(event, ...args);
    return socket;
  };

  return {
    socket,
    firstConnection,
    get isConnected() {
      return isConnected.value;
    },
    on(event, listener) {
      socket.on(event, listener as any);

      onUnmounted(() => {
        socket.off(event, listener as any);
      });

      return socket;
    },
    emit,
  };
}

export function provideSocketState(socketState: SocketState) {
  provide(SOCKET_STATE_INJECTION_KEY, socketState);
}

export function useSocketState() {
  return inject(SOCKET_STATE_INJECTION_KEY)!;
}

type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
