import express from "express";

import accountRouter from "./account.router";
import authRouter from "./auth.router";
import casesRouter from "./cases.router";
import giftRouter from "./gift.router";
import paymentRouter from "./payment.router";

const router = express.Router();

export const initRouters = (context: Context): express.Router => {
  router.use("/account", accountRouter(context));
  router.use("/auth", authRouter(context));
  router.use("/cases", casesRouter(context));
  router.use("/gift", giftRouter(context));
  router.use("/payment", paymentRouter(context));

  router.get("/healthcheck", async (_req, res) => {
    await context.prisma.$queryRaw`SELECT 1`;
    return res.send("ok");
  });

  return router;
};
