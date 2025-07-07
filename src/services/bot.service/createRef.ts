
import { onTextCallback } from "./utils";
import { ReferralService } from "../referral.service";
import { config } from '@/config'

export const createRef = onTextCallback(async ({}, {prisma}) => {
  const referral = await prisma.$transaction(async (tx) => {
    const referralService = new ReferralService();

    const referrals_count = await tx.account.count({
      where: {
        username: {
          startsWith: "referral_",
        },
      },
    });
    const account = await tx.account.create({
      data: {
        username: `referral_${referrals_count + 1}`,
      },
    });
    const referral = await referralService.createReferral(tx, {
      accountId: account.id,
    });
    return referral;
  });

  const data = {
    value: referral.value,
    link: `t.me/${config.bot.name}?startapp=${referral.value}`,
  };

  return data;
});
