import { PrismaClient } from "@prisma/client";
import { initLogger } from "modules/logger.module";

const initContext = async (): Promise<Context> => {
  const prisma = new PrismaClient();
  await prisma.$connect();

  const logger = initLogger();

  const context: Context = Object.freeze({
    prisma,
    logger,
  });

  return context;
};

export { initContext };
