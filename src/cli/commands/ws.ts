import { wrapper } from "../utils";
import "dotenv/config";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cron.schedule("0 * * * *", async () => {
  try {
    console.log(
      "NFT_PRICE_CRON_JOB",
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString(),
    );
    await marketplaceService.updatePrices(prisma);

    const data = await CaseService.analytics(prisma);
    const alert_data = data.filter((item) => item.price < item.price_0_margin);
    if (alert_data.length) {
      await new BotService(prisma).casePriceAlert(alert_data);
    }
  } catch (error) {
    console.error(error);
  }
});

cron.schedule("* * * * *", async () => {
  await tonService.onDepositTx(prisma);
});

wrapper(async ({ context }) => {
  new BotService(context.prisma, true).listen();
}, false);
