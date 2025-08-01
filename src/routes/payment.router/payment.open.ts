import { TransactionType, TransactionCurrency } from "@prisma/client";
import {
  allowedFirstCaseIds,
  CaseService,
  caseService,
} from "@/services/case.service";
import { findMinAboveN, getProbability } from "@/utils/number";

type ResponseData = {
  id: string;
  isTon: boolean;
  nft: { id: string; title: string; price: number; sku: string };
};

export async function PaymentOpen(
  prisma: Context["prisma"],
  acc: Express.Request["account"],
  payload: { caseId: string; transactionId: string },
) {
  const gift = await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: acc?.id,
      },
      include: {
        gifts: true,
      },
    });

    const transaction = await tx.transaction.findUniqueOrThrow({
      where: {
        id: payload.transactionId,
        accountId: account.id,
        type: TransactionType.deposit,
        currency: TransactionCurrency.star,
        accountGift: null,
      },
    });

    const giftCase = await tx.gift_case.findFirstOrThrow({
      where: {
        id: payload.caseId,
        isArchived: false,
        starPrice: transaction.amount,
      },
      select: {
        id: true,
        price: true,
        exponent: true,
        gifts: {
          select: {
            id: true,
            title: true,
            sku: true,
            price: true,
          },
          orderBy: {
            price: "desc",
          },
        },
      },
    });

    if (
      !account.gifts.length &&
      allowedFirstCaseIds.includes(giftCase.id) &&
      getProbability(50)
    ) {
      const gift = findMinAboveN(giftCase.gifts, giftCase.price);

      const accountGift = await tx.account_gift.create({
        data: {
          accountId: account.id,
          nftId: gift.id,
          caseId: giftCase.id,
          price: gift.price,
          transaction: {
            connect: {
              id: transaction.id,
            },
          },
        },
        include: {
          nft: true,
        },
      });

      const responseData: ResponseData = {
        id: accountGift.id,
        isTon: false,
        nft: {
          id: gift.id,
          price: gift.price,
          sku: gift.sku,
          title: gift.title,
        },
      };

      return responseData;
    }

    const gift = caseService.open(giftCase.gifts, giftCase.exponent);
    const isTon = gift.title === CaseService.TON_GIFT.toUpperCase();

    const accountGift = await tx.account_gift.create({
      data: {
        accountId: account.id,
        nftId: gift.id,
        caseId: giftCase.id,
        price: gift.price,
        isSold: isTon,
        transaction: {
          connect: {
            id: transaction.id,
          },
        },
      },
      include: {
        nft: true,
      },
    });

    if (isTon) {
      await tx.account.update({
        where: {
          id: account.id,
        },
        data: {
          balance: {
            increment: gift.price,
          },
        },
      });
    }

    const responseData: ResponseData = {
      id: accountGift.id,
      isTon,
      nft: {
        id: gift.id,
        price: gift.price,
        sku: gift.sku,
        title: gift.title,
      },
    };

    return responseData;
  });

  return { gift };
}
