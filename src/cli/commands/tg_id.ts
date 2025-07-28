import { toFile, toFileTxt, wrapper } from "../utils";
import "dotenv/config";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { caseService, CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

wrapper(async ({ context }) => {
  const a = await context.prisma.account.findMany({
    select: {
      telegramId: true,
    },
  });
  toFileTxt(a.map((i) => i.telegramId).join("\n"));
});
