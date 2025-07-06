import { BonusType } from '@prisma/client'
import {
  caseService,
} from "@/services/case.service";
import { freeCase } from "@/services/case.service";

type ResponseData = {
  id: string;
  title: string;
  price: number;
  sku: string;
};

export async function CaseOpenFree(prisma: Context['prisma'], acc: Express.Request['account'], payload: { caseId: string; isDemo?: boolean }) {
  const reward = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: acc?.id
      },
      include: {
        bonuses: {
          where: {
            type: BonusType.case,
            isUsed: false,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    const bonus = account.bonuses.shift();
    if (!bonus) throw new Error("NO_KEYS");

    await tx.$executeRaw`SELECT * FROM bonuses WHERE account_id = ${account.id} FOR UPDATE`;

    const reward = caseService.open(freeCase);

    await tx.account.update({
      where: {
        id: account.id,
      },
      data: {
        balance: {
          increment: reward.price,
        },
      },
    });

    await tx.bonus.update({
      where: {
        id: bonus.id,
      },
      data: {
        isUsed: true,
      },
    });

    const responseData: ResponseData = {
      id: reward.id,
      price: reward.price,
      sku: reward.sku,
      title: reward.title,
    };

    return responseData;
  });

  return { reward }
}
