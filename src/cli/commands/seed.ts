import { wrapper } from "../utils";
import "dotenv/config";

import account from "../../../dump/account.json";
import nft from "../../../dump/nft.json";
import cases from "../../../dump/case.json";

// pnpm prisma generate --no-engine
// pnpm prisma migrate reset
// pnpm prisma migrate dev --create-only --name init
// pnpm prisma migrate deploy

wrapper(async ({ context }) => {
  await context.prisma.account.create({
    // @ts-ignore
    data: account,
  });
  await context.prisma.nft.createMany({
    data: nft,
  });
  await context.prisma.gift_case.createMany({
    data: cases,
  });
});
