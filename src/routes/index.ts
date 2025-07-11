import express from "express";

import accountRouter from "./account.router";
import authRouter from "./auth.router";
import caseRouter from "./case.router";
import giftRouter from "./gift.router";
import paymentRouter from "./payment.router";
import raffleRouter from "./raffle.router";

const router = express.Router();

export const initRouters = (context: Context): express.Router => {
  router.use("/account", accountRouter(context));
  router.use("/auth", authRouter(context));
  router.use("/cases", caseRouter(context));
  router.use("/gift", giftRouter(context));
  router.use("/payment", paymentRouter(context));
  router.use("/raffle", raffleRouter(context));

  router.get("/healthcheck", async (_req, res) => {
    await context.prisma.$queryRaw`SELECT 1`;
    return res.send("ok");
  });

  return router;
};
