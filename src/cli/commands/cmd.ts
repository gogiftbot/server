import "dotenv/config";

import { sleep, toFile, toFileTxt, wrapper } from "../utils";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { mapper, marketplaceService } from "@/services/marketplace.service";
import { caseService, CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";

wrapper(async ({ context }) => {
  const giftCase = await context.prisma.gift_case.findUniqueOrThrow({
    where: {
      id: "314e391d-5d5e-437c-a0f0-a33c1cd8a5ed",
    },
    select: {
      gifts: true,
    },
  });

  let plus = 0;
  for (let i = 0; i < 1000; i++) {
    const gift = caseService.open(giftCase.gifts, 1.1);
    plus += gift.price;
  }

  console.log(plus, "ton");
});
