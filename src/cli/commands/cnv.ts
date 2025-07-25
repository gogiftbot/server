import { toFile, wrapper } from "../utils";
import "dotenv/config";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";
import fs from "fs";

wrapper(async ({ context }) => {
  const nfts = await context.prisma.gift_case.findMany({
    select: {
      id: true,
      title: true,
      price: true,
      gifts: {
        select: {
          id: true,
          title: true,
          price: true,
        },
      },
    },
  });
  toFile(nfts);
});
