import { PrismaClient } from "@/generated/prisma";
import { initLogger } from "@/modules/logger.module";

export const context: Context = Object.freeze({
  prisma: new PrismaClient({
    transactionOptions: {
      timeout: 10_000,
    },
  }),
  logger: initLogger(),
});
