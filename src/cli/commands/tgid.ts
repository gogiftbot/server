import "dotenv/config";

import { sleep, toFile, toFileTxt, wrapper } from "../utils";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";
import { getRandomArrayElement, getRandomNumber } from "@/utils/number";

const intervalWrapper = async (
  callback: () => Promise<void>,
  options: { min: number; max: number },
) =>
  callback().finally(() =>
    setTimeout(
      () => intervalWrapper(callback, options),
      getRandomNumber(options.min, options.max) * 1000,
    ),
  );

wrapper(async ({ context }) => {}, false);
