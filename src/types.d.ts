declare interface Context {
  prisma: import("@prisma/client").PrismaClient;
  cache: import("@/modules/cache.module").CacheI;
  pubsub: import("@/modules/pubsub.module").PubsubI;
  logger: import("@/modules/logger.module").LoggerI;
}

declare namespace Express {
  interface Request {
    account?: { id: string };
  }

  interface Response {}
}

declare type PrismaTransaction = Parameters<
  Parameters<Context["prisma"]["$transaction"]>[0]
>[0];
