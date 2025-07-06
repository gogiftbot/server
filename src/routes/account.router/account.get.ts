import { BonusType } from '@prisma/client'

export async function AccountGet(prisma: Context['prisma'], acc: Express.Request['account']) {
  const account = await prisma.account.findUniqueOrThrow({
    where: {
      id: acc?.id,
    },
    include: {
      _count: {
        select: {
          gifts: true,
        },
      },
      gifts: {
        include: {
          nft: true,
          case: true,
        },
        where: {
          isWithdraw: false,
          isSold: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      bonuses: {
        where: {
          isUsed: false,
          type: BonusType.deposit,
        },
        orderBy: {
          value: "desc",
        },
        take: 1,
      },
      transactions: true,
      referral: {
        include: {
          accounts: {
            include: {
              transactions: true,
              _count: {
                select: {
                  gifts: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return account
}
