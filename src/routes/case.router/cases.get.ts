import { BonusType } from "@prisma/client";
import { freeCase } from "@/services/case.service";

const getFreeCaseKeysCount = async (
  prisma: Context["prisma"],
  accountId?: string,
) => {
  if (!accountId) return 0;
  return prisma.bonus.count({
    where: {
      type: BonusType.case,
      isUsed: false,
      accountId,
    },
  });
};

export async function CasesGet(
  prisma: Context["prisma"],
  acc: Express.Request["account"],
) {
  const cases = await prisma.gift_case.findMany({
    where: {
      isArchived: false,
    },
    include: {
      gifts: {
        select: {
          id: true,
          title: true,
          sku: true,
          price: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          price: "desc",
        },
      },
    },
    orderBy: {
      price: "asc",
    },
  });

  const targetIndex = cases.findIndex(
    (item) => item.title === "Sweet Surprise",
  );

  if (targetIndex !== -1) {
    const [targetItem] = cases.splice(targetIndex, 1);
    cases.unshift(targetItem);
  }

  const keys = await getFreeCaseKeysCount(prisma, acc?.id);

  return { cases, free: { rewards: freeCase, keys } };
}
