import "dotenv/config";

import { sleep, toFile, toFileTxt, wrapper } from "../utils";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { mapper, marketplaceService } from "@/services/marketplace.service";
import { caseService, CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";

wrapper(async ({ context }) => {
  await context.prisma.$transaction(async (tx) => {
    await tx.nft.createMany({
      data: [
        {
          id: "e85fa59c-eb73-41ef-8b56-a177a689c217",
          price: 54.87,
          sku: "westside-sign",
          title: "Westside Sign",
        },
        {
          id: "512cdff8-1feb-44c4-b7f3-80522ed24e02",
          price: 23.7,
          sku: "low-rider",
          title: "Low Rider",
        },
        {
          id: "bd70a456-60d7-4ac9-afd4-1bea88d2ee3d",
          price: 4.09,
          sku: "snoop-cigar",
          title: "Snoop Cigar",
        },
        {
          id: "da4c4383-6654-45e3-bcd9-0b54926418db",
          price: 1.29,
          sku: "snoop-dog",
          title: "Snoop Dog",
        },
        {
          id: "8a99c435-d75b-4c4d-b0e0-f0097ec9fbd7",
          price: 1.58,
          sku: "swag-bag",
          title: "Swag Bag",
        },
      ],
    });

    await tx.gift_case.create({
      data: {
        price: 4,
        starPrice: 1000,
        exponent: 1.15,
        sku: "goldizzle.png",
        title: "Westside",
        gifts: {
          connect: [
            {
              id: "e85fa59c-eb73-41ef-8b56-a177a689c217",
            },
            {
              id: "512cdff8-1feb-44c4-b7f3-80522ed24e02",
            },
            {
              id: "bd70a456-60d7-4ac9-afd4-1bea88d2ee3d",
            },
            {
              id: "da4c4383-6654-45e3-bcd9-0b54926418db",
            },
            {
              id: "8a99c435-d75b-4c4d-b0e0-f0097ec9fbd7",
            },
          ],
        },
      },
    });
  });

  await marketplaceService.updatePrices(context.prisma);
});
