import { createRequestHandler } from "@remix-run/express";
import express from "express";
import { createServer } from "http";
import { initializeWebSockets } from "~/services/websocket.server";

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
initializeWebSockets(httpServer);

// Initialize Remix
app.all(
  "*",
  createRequestHandler({
    build: require("../build"),
    mode: process.env.NODE_ENV,
  })
);

const port = process.env.PORT || 3000;
httpServer.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
