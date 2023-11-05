import { Socket, Server as SocketIoServer } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../shared/src/index.js';

export type AppSocketServer = SocketIoServer<
  ClientToServerEvents,
  ServerToClientEvents
>;

export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents>;
