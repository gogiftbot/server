import { TransactionStatus, TransactionType } from "@prisma/client";
import { AccountService } from "@/services/account.service";

export async function GiftWithdraw(
  prisma: Context["prisma"],
  acc: Express.Request["account"],
  payload: { accountGiftId: string },
) {
  const transaction = await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT * FROM account_gifts WHERE id = ${payload.accountGiftId} FOR UPDATE`;

    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: acc?.id,
      },
    });

    if (account.isBlocked) throw new Error("BLOCKED");

    const accountGift = await tx.account_gift.findFirstOrThrow({
      where: {
        id: payload.accountGiftId,
        accountId: account.id,
        isSold: false,
        isWithdraw: false,
      },
    });

    await tx.account_gift.update({
      where: {
        id: accountGift.id,
      },
      data: {
        isWithdraw: true,
      },
    });

    const transaction = await tx.transaction.create({
      data: {
        amount: accountGift.price,
        accountId: account.id,
        status: TransactionStatus.pending,
        account_giftId: accountGift.id,
        type: TransactionType.withdraw,
      },
    });

    return transaction;
  });

  await new AccountService(prisma).withdraw({ transactionId: transaction.id });
}
