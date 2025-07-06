import { onTextCallback } from "./utils";
import { CaseService } from "../case.service";
import { numberToString } from "@/utils/number";

export const getCasesPrices = onTextCallback(async ({}, {prisma}) => {
  const analytics = await CaseService.analytics(prisma);

  return analytics.map((item) => ({
    case: item.case,
    price: `${numberToString(item.price)} TON`,
    margin: `${numberToString(
      ((item.price - item.price_0_margin) / item.price_0_margin) * 100
    )}%`,
    "price (0%)": `${numberToString(item.price_0_margin)} TON`,
    "price (50%)": `${numberToString(item.price_50_margin)} TON`,
  }));
});
