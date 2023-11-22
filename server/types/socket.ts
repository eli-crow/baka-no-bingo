import { ClientToServerEvents, ServerToClientEvents } from 'shared/src/index.js';
import { Socket, Server as SocketIoServer } from 'socket.io';
import { SocketReservedEventsMap } from 'socket.io/dist/socket.js';

export type AppSocketServer = SocketIoServer<ClientToServerEvents, ServerToClientEvents>;
export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
export type AppSocketEventName = keyof ClientToServerEvents | keyof SocketReservedEventsMap;
export type AppSocketEventParameters<T extends AppSocketEventName> = T extends keyof ClientToServerEvents
  ? Parameters<ClientToServerEvents[T]>
  : T extends keyof SocketReservedEventsMap
  ? Parameters<SocketReservedEventsMap[T]>
  : never;
