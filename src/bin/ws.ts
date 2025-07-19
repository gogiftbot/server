import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

import { config } from "@/config";

import { loggerMiddleware } from "./logger.middleware";
import { context } from "./context";
import { onShutdown } from "./utils/shutdown";

const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions,
  path: "/",
});

io.on("connection", (_socket) => {});

context.pubsub.live.subscribe(async (data) => {
  io.emit("LIVE", data);
});

app.use(express.json({ limit: 81920 }));
app.use(loggerMiddleware(context.logger));

const PORT = config.PORT;

server.listen({ port: PORT }, () => {
  console.log(`🚀 WS server listening at: ws://localhost:${PORT}`);
});

onShutdown(async () => {
  await context.prisma.$disconnect();
});

export { app };
