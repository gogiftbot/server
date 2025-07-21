import http from "http";
import express from "express";
import cors from "cors";
import { Server } from "socket.io";

import { config } from "@/config";
import { initRouters } from "@/routes";

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
  cors: {
    origin: "*",
  },
});

context.pubsub.live.subscribe(async (data) => {
  io.emit("LIVE", data);
});

app.use(express.json({ limit: 81920 }));
app.use(loggerMiddleware(context.logger));
app.use(cors(corsOptions));

app.use(async (req: express.Request, _res, next) => {
  const authorization = req.headers["authorization"];
  if (authorization) {
    const buff = Buffer.from(authorization, "base64");
    const accountId = buff.toString("utf-8");

    await context.prisma.account.findUniqueOrThrow({
      where: { id: accountId },
      select: { id: true },
    });
    req.account = { id: accountId };
  }

  next();
});

app.use(initRouters(context));

const PORT = config.PORT;

server.listen({ port: PORT }, () => {
  console.log(`🚀 HTTP server listening at: http://localhost:${PORT}`);
});

onShutdown(async () => {
  await context.prisma.$disconnect();
});
