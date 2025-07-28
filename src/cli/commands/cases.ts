import "dotenv/config";

import { sleep, toFile, toFileTxt, wrapper } from "../utils";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { mapper, marketplaceService } from "@/services/marketplace.service";
import { caseService, CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";

wrapper(async ({ context }) => {
  const cases = await context.prisma.gift_case.findUniqueOrThrow({
    where: {
      id: "9aef821f-d524-430e-bc0c-43472cd18780",
    },
    select: {
      id: true,
      title: true,
      price: true,
      gifts: {
        select: {
          id: true,
          sku: true,
          title: true,
          price: true,
        },
      },
    },
  });
  console.log(caseService.calculateOdds(cases.gifts, 2));
});
