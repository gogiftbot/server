import { toFile, wrapper } from "../utils";
import "dotenv/config";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";
// helmet-giveaway
wrapper(async ({ context }) => {
  // const t = await new BotService(context.prisma).bot.getChatMember(
  //   -1002568311629,
  //   341856633,
  // );
  // console.log(t);
  // t.status = administrator left member || error if not found

  await context.prisma.raffleNft.create({
    data: {
      id: "aa68fba5-4304-4cca-9088-8c5f3624c143",
      title: "Light Speed",
      price: 31.11,
      sku: "helmet-giveaway",
    },
  });

  await context.prisma.raffle.createMany({
    data: [
      {
        id: "97e8f432-7958-4870-99db-92e0c0b092cc",
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        nftId: "aa68fba5-4304-4cca-9088-8c5f3624c143",
      },
    ],
  });

  await context.prisma.raffleTask.createMany({
    data: [
      {
        id: "1c613fc1-b4ed-469e-b72d-09505d8d086d",
        titleRU: "Голосуй за нас",
        titleEN: "Vote for us",
        linkTitle: "@tapps",
        linkUrl: "https://t.me/tapps_bot/center?startapp=app_gogift",
        raffleId: "97e8f432-7958-4870-99db-92e0c0b092cc",
        createdAt: new Date(),
      },
    ],
  });
});
