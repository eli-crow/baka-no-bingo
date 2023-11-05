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
const port = 8080;

const io = new SocketIoServer<ClientToServerEvents, ServerToClientEvents>(
  http,
  {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ['GET', 'POST'],
    },
  }
);

new RoomCoordinator(io);

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});
