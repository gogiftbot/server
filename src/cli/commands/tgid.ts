import "dotenv/config";

import { sleep, toFile, toFileTxt, wrapper } from "../utils";
import cron from "node-cron";
import { BotService } from "@/services/bot.service";
import { marketplaceService } from "@/services/marketplace.service";
import { CaseService } from "@/services/case.service";
import { tonService } from "@/services/ton.service";
import { PrismaClient } from "@prisma/client";

wrapper(async ({ context }) => {
  const res = await fetch(
    `https://portals-market.com/partners/users/341856633`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: "partners eda29b65-7f66-4c52-8712-d617399d2b60",
      },
    },
  );

  const d = await res.json();
  console.log(d);
});
