import { Server as SocketIoServer, Socket } from 'socket.io';
import { ClientToServerEvents, ServerToClientEvents } from 'shared/src';

export type AppSocketServer = SocketIoServer<
  ClientToServerEvents,
  ServerToClientEvents
>;

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
