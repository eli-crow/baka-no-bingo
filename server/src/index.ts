import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIoServer } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../shared/src/index.js';
import RoomCoordinator from './RoomCoordinator.js';

dotenv.config();

const app = express();
const http = createServer(app);
const port = Number(process.env.PORT);

const io = new SocketIoServer<ClientToServerEvents, ServerToClientEvents>(
  http,
  {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
    connectionStateRecovery: {
      maxDisconnectionDuration: Number(
        process.env.MAX_DISCONNECTION_DURATION_MS
      ),
      skipMiddlewares: true,
    },
  }
);

new RoomCoordinator(io);

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
