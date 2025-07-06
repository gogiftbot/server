import { BonusType } from '@prisma/client'

export async function AccountPromo(prisma: Context['prisma'], acc: Express.Request['account'], payload: { value: string }) {
  const bonus = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: acc?.id,
      },
      include: {
        bonuses: true,
      },
    });

    await tx.$executeRaw`SELECT * FROM bonuses WHERE account_id = ${account.id} FOR UPDATE`;

    const promo = await tx.promo_code.findUnique({
      where: {
        value: payload.value.trim().toLowerCase(),
      },
    });

    if (!promo) {
      throw new Error("PromoNotFound");
    }

    if (promo.uses <= 0) {
      throw new Error("PromoNoUses");
    }

    if (account.bonuses.some((bonus) => bonus.promoCodeId === promo.id)) {
      throw new Error("PromoUsed");
    }

    await tx.promo_code.update({
      where: {
        id: promo.id,
      },
      data: {
        uses: {
          decrement: 1,
        },
      },
    });

    if (promo.isFreeCase) {
      return tx.bonus.create({
        data: {
          accountId: account.id,
          promoCodeId: promo.id,
          type: BonusType.case,
        },
      });
    } else {
      return tx.bonus.create({
        data: {
          accountId: account.id,
          promoCodeId: promo.id,
          value: promo.bonusValue,
          type: BonusType.deposit,
        },
      });
    }
  });

  return bonus;

}
