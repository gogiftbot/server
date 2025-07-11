export async function RafflesGet(
  prisma: Context["prisma"],
  acc: Express.Request["account"],
) {
  const raffles = await prisma.raffle.findMany({
    orderBy: {
      endDate: "desc",
    },
    include: {
      _count: {
        select: { accounts: true },
      },
      nft: true,
      tasks: {
        orderBy: {
          createdAt: "asc",
        },
      },
      accounts: {
        where: {
          id: acc?.id,
        },
        select: {
          id: true,
        },
      },
    },
  });

  return { raffles };
}
