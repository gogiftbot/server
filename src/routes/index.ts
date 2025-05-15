import express, { Request, Response, NextFunction } from "express";

import botRouter from "./bot.router";

const router = express.Router();

export const initRouters = (context: Context): express.Router => {
  router.use("/v1/bot", botRouter(context));

  return router;
};
