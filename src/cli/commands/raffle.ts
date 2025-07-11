import { toFile, wrapper } from "../utils";
import "dotenv/config";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";

wrapper(async ({ context }) => {
  // const t = await new BotService(context.prisma).bot.getChatMember(
  //   -1002568311629,
  //   341856633,
  // );
  // console.log(t);
  // t.status = administrator left member || error if not found

  await context.prisma.raffleNft.create({
    data: {
      id: "b3aed9cf-1f98-415d-9c24-ccc3138ca66f",
      title: "Cerry Time",
      price: 37.11,
      sku: "swiss-giveaway",
    },
  });

  await context.prisma.raffle.createMany({
    data: [
      {
        id: "0ccc3017-5719-4ce6-b68a-e47b220e2907",
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        nftId: "b3aed9cf-1f98-415d-9c24-ccc3138ca66f",
      },
    ],
  });

  await context.prisma.raffleTask.createMany({
    data: [
      {
        id: "f8384203-f9ec-4931-be35-acf1b250d0f0",
        titleRU: "Подпишись на",
        titleEN: "Subscribe to",
        linkTitle: "@GoGift",
        linkUrl: "https://t.me/GoGift_official_bot",
        raffleId: "0ccc3017-5719-4ce6-b68a-e47b220e2907",
        // createdAt: new Date(Date.now() - 1000),
      },
      // {
      //   titleRU: "Голосуй за нас",
      //   titleEN: "Vote for us",
      //   linkTitle: "@tapps",
      //   linkUrl: "https://t.me/tapps_bot/center?startapp=app_gogift",
      //   raffleId: "0ccc3017-5719-4ce6-b68a-e47b220e2907",
      //   createdAt: new Date(),
      // },
    ],
  });
});
