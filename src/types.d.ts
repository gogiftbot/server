declare interface Context {
  prisma: import("@/generated/prisma").PrismaClient;
  logger: import("modules/logger.module").LoggerI;
}

declare namespace Express {
  interface Request {
    account?: { id: string };
  }

  interface Response {}
}
