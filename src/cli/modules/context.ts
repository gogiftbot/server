import { PrismaClient } from "@prisma/client";
import { initLogger } from "@/modules/logger.module";
import { initCache } from "@/modules/cache.module";
import { initPubsub } from "@/modules/pubsub.module";

const initContext = (): Context => {
  const prisma = new PrismaClient();
  prisma.$connect();

  const logger = initLogger();
  // const cache = initCache();
  // const pubsub = initPubsub();

  // @ts-ignore
  const context: Context = Object.freeze({
    prisma,
    logger,
    // cache,
    // pubsub,
  });

  return context;
};

export { initContext };
