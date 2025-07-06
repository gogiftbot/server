import { TransactionType, TransactionStatus, TransactionCurrency } from '@prisma/client'
import { BotService } from "@/services/bot.service"

export async function PaymentCreate(prisma: Context['prisma'], acc: Express.Request['account'], payload: { caseId: string; }) {
  const response = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: acc?.id
      },
    });

    const giftCase = await tx.gift_case.findFirstOrThrow({
      where: {
        id: payload.caseId,
        isArchived: false,
      },
      select: {
        id: true,
        title: true,
        starPrice: true,
      },
    });

    if (!giftCase.starPrice) throw new Error("InvalidStarPrice");

    const transaction = await tx.transaction.create({
      data: {
        amount: giftCase.starPrice,
        accountId: account.id,
        type: TransactionType.deposit,
        status: TransactionStatus.pending,
        currency: TransactionCurrency.star,
      },
      select: {
        id: true,
      },
    });

    const link = await new BotService(prisma).createPaymentLink({
      amount: giftCase.starPrice,
      title: giftCase.title,
      transactionId: transaction.id,
    });

    return { link, transactionId: transaction.id };
  });

  return response
}
