import express, { Request, Response, NextFunction } from "express";

import accountRouter from "./account.router";
import casesRouter from "./cases.router";
import giftRouter from "./gift.router";
import paymentRouter from "./payment.router";

const router = express.Router();

export const initRouters = (context: Context): express.Router => {
  router.use("/account", accountRouter(context));
  router.use("/cases", casesRouter(context));
  router.use("/gift", giftRouter(context));
  router.use("/payment", paymentRouter(context));

  return router;
};
