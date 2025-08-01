import "dotenv/config";

import { sleep, toFile, toFileTxt, wrapper } from "../utils";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { mapper, marketplaceService } from "@/services/marketplace.service";
import { caseService, CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";
import { numberToString } from "@/utils/number";

wrapper(async ({ context }) => {
  const cases = await context.prisma.gift_case.findUniqueOrThrow({
    where: {
      id: "314e391d-5d5e-437c-a0f0-a33c1cd8a5ed",
    },
    include: {
      gifts: true,
    },
  });
  // console.log(caseService.calculateOdds(cases.gifts, 2));
  await marketplaceService.updatePrices(context.prisma);
  const [analytics] = await CaseService.jsonAnalytics([cases]);
  console.log(
    analytics.price_0_margin,
    `${numberToString(
      ((cases.price - analytics.price_0_margin) / analytics.price_0_margin) *
        100,
    )}%`,
  );
});
