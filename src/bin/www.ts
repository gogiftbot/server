import http from "http";
import express from "express";
import cors from "cors";

import { config } from "@/config";
import { initRouters } from "@/routes";
import { BotService } from "@/services/bot.service";

import { loggerMiddleware } from "./logger.middleware";
import { context } from "./context";
import { onShutdown } from "./utils/shutdown";

const corsOptions: cors.CorsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

new BotService(context).start();

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: 81920 }));
app.use(loggerMiddleware(context.logger));
app.use(cors(corsOptions));

app.use(initRouters(context));

const PORT = config.PORT;

server.listen({ port: PORT }, () => {
  console.log(`🚀 HTTP server listening at: http://localhost:${PORT}`);
});

onShutdown(async () => {
  await context.prisma.$disconnect();
});

export { app };
