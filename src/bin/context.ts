import { PrismaClient } from "@prisma/client";
import { initLogger } from "@/modules/logger.module";
import { initCache } from "@/modules/cache.module";
import { initPubsub } from "@/modules/pubsub.module";

export const initContext = (): Context => {
  const prisma = new PrismaClient();
  prisma.$connect();

  const logger = initLogger();
  const cache = initCache(logger);
  const pubsub = initPubsub();

  const context: Context = Object.freeze({
    prisma,
    logger,
    cache,
    pubsub,
  });

  return context;
};

export const context = initContext();
