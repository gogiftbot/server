declare interface Context {
  prisma: import("@prisma/client").PrismaClient;
  logger: import("modules/logger.module").LoggerI;
}

declare namespace Express {
  interface Request {
    account?: { id: string };
  }

  interface Response {}
}

declare type PrismaTransaction =  Parameters<Parameters<Context['prisma']['$transaction']>[0]>[0];