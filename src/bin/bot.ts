import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { getRandomArrayElement } from "@/utils/number";
import { context } from "./context";
import { intervalWrapper } from "@/utils/wrapper";

intervalWrapper(
  async () => {
    try {
      const nfts = await context.prisma.nft.findMany({
        select: {
          id: true,
          sku: true,
          price: true,
        },
        where: {
          sku: {
            not: "ton",
          },
        },
      });

      const nft = getRandomArrayElement(nfts);

      await context.pubsub.live.publish({
        id: nft.id,
        nft: { sku: nft.sku },
        price: nft.price,
      });
    } catch (_) {}
  },
  {
    min: 5,
    max: 30,
  },
);

cron.schedule("0 * * * *", async () => {
  try {
    console.log(
      "NFT_PRICE_CRON_JOB",
      new Date().toLocaleDateString(),
      new Date().toLocaleTimeString(),
    );
    await marketplaceService.updatePrices(context.prisma);

    const data = await CaseService.analytics(context.prisma);
    const alert_data = data.filter((item) => item.price < item.price_0_margin);
    if (alert_data.length) {
      await new BotService(context.prisma).casePriceAlert(alert_data);
    }
  } catch (error) {
    console.error(error);
  }
});

cron.schedule("* * * * *", async () => {
  await tonService.onDepositTx(context.prisma);
});

new BotService(context.prisma, true).listen();
