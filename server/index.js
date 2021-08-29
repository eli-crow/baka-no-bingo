import dotenv from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import initSocket from "./socket.js";

dotenv.config()

const app = express()
const http = createServer(app)
const port = 8080

initSocket(http)

http.listen(port, () => {
    console.log(`listening on *:${port}`);
});