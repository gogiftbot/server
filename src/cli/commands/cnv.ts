import { toFile, wrapper } from "../utils";
import "dotenv/config";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { LottieConverter } from "lottie-image";
import lottieJsonObjectData from "./swiss-giveaway.json";

wrapper(async ({ context }) => {
  // convertWithCanvas("./swiss-giveaway.json", "./b.png");
  const cvter = new LottieConverter({});
  await cvter.dataSaveAs({
    lottieData: lottieJsonObjectData,
    outputPath: "i.png", //
  });
});
