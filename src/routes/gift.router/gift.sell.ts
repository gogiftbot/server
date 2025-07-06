export async function GiftSell(prisma: Context['prisma'], acc: Express.Request['account'], payload: { accountGiftId: string; }) {
  await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: acc?.id
      },
    });

    const accountGift = await tx.account_gift.findFirstOrThrow({
      where: {
        id: payload.accountGiftId,
        accountId: account.id,
        isSold: false,
        isWithdraw: false,
      },
    });

    await tx.$executeRaw`SELECT * FROM account_gifts WHERE id = ${accountGift.id} FOR UPDATE`;

    await tx.account_gift.update({
      where: {
        id: accountGift.id,
      },
      data: {
        isSold: true,
      },
    });

    await tx.account.update({
      where: {
        id: account.id,
      },
      data: {
        balance: {
          increment: accountGift.price,
        },
      },
    });
  });
}
