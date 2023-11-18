import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import { Server as SocketIoServer } from 'socket.io';
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../shared/src/index.js';
import { getRandomEpisode } from './data/episodes.js';
import Coordinator from './game/Coordinator.js';

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

new Coordinator(io);

http.listen(port, () => {
  console.log(`listening on *:${port}`);
});

app.get('/random-episode', (req, res) => {
  res.send(getRandomEpisode());
});
