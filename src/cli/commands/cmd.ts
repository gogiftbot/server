import "dotenv/config";

import { sleep, toFile, toFileTxt, wrapper } from "../utils";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { mapper, marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";

wrapper(async ({ context }) => {
  await context.prisma.nft.createMany({
    data: [
      {
        id: "de4d3232-532c-4f00-bd73-eade7ce54091",
        price: 14.5,
        title: "Cupid Charm",
        sku: "cupid-charm",
      },
      {
        id: "4bd408bc-2916-41dc-92e9-5fa421f742cc",
        price: 2.97,
        title: "Joyful Bundle",
        sku: "joyful-bundle",
      },
      {
        id: "597d2241-2be3-41fd-90c7-bb5fcd1330ee",
        price: 4.6,
        title: "Valentine Box",
        sku: "valentine-box",
      },
      {
        id: "79188672-1866-430b-af0c-745a49ecb145",
        price: 0.5,
        title: "TON",
        sku: "ton",
      },
    ],
  });

  await context.prisma.gift_case.create({
    data: {
      id: "9aef821f-d524-430e-bc0c-43472cd18780",
      title: "Sweet Surprise",
      price: 1.5,
      starPrice: 400,
      sku: "sweet-surprise",
      gifts: {
        connect: [
          {
            id: "327d191a-97ee-409f-8bd5-c91d5e386571", // 1 ton
          },
          {
            id: "210eca60-d829-48dd-a22f-89739f579ec8", // 0.8
          },
          {
            id: "79188672-1866-430b-af0c-745a49ecb145", //0.5
          },
          {
            id: "de4d3232-532c-4f00-bd73-eade7ce54091",
          },
          {
            id: "4bd408bc-2916-41dc-92e9-5fa421f742cc",
          },
          {
            id: "597d2241-2be3-41fd-90c7-bb5fcd1330ee",
          },
          { id: "b4c5d6e7-f8g9-5678-9012-345678901234" },
          { id: "06c8b1dd-359c-47a6-b995-7b0f65e63799" },
          { id: "a3b4c5d6-e7f8-4567-8901-234567890123" },
          { id: "ed365cdb-7caa-436b-b50a-1598d831fa77" },
          { id: "a2994033-ed47-4ec2-a37a-2df5ed83fabf" },
          { id: "c3d4e5f6-a7b8-9012-3456-7890abcdef12" },
          { id: "e5f6a7b8-c9d0-1234-5678-90abcdef1234" },
          {
            id: "h4i5j6k7-l8m9-abcd-ef12-345678901234",
          },
          { id: "a7b8c9d0-e1f2-3456-789a-bcdef1234567" },
          { id: "c500a1ff-6c8e-4e4f-8eac-6ea36c678df7" },
          { id: "l8m9n0o1-p2q3-ef12-3456-789012345678" },
          {
            id: "b8c9d0e1-f2g3-4567-89ab-cdef12345678",
          },
          { id: "c70e4ceb-002a-464c-b513-d3410d105035" },
          {
            id: "u7v8w9x0-y1z2-8901-2345-678901234567",
          },
        ],
      },
    },
  });

  await marketplaceService.updatePrices(context.prisma);
});
