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
      id: "8e0a43ab-0df6-4d33-9f07-013884cc5cec",
      title: "Genie Lamp",
      price: 57.19,
      sku: "genie-lamp",
    },
  });

  await context.prisma.raffle.createMany({
    data: [
      {
        id: "421f6723-37ff-4ab4-8727-a8d48f28aa77",
        endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        nftId: "8e0a43ab-0df6-4d33-9f07-013884cc5cec",
      },
    ],
  });

  await context.prisma.raffleTask.createMany({
    data: [
      {
        id: "9d536207-c7a4-4066-a17f-639d807a33ac",
        titleRU: "Пригласи 1 друга",
        titleEN: "Invite 1 friend",
        linkTitle: "friends",
        linkUrl: "/affiliate",
        raffleId: "421f6723-37ff-4ab4-8727-a8d48f28aa77",
        createdAt: new Date(),
      },
    ],
  });
});
