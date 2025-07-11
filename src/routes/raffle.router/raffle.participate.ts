import { BotService } from "@/services/bot.service";

// const TaskIdToChanelId: Record<string, number> = {
//   "f8384203-f9ec-4931-be35-acf1b250d0f0": -1002568311629,
// };

export async function RaffleParticipate(
  prisma: Context["prisma"],
  acc: Express.Request["account"],
  payload: { raffleId: string },
  botService: BotService,
) {
  await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: acc?.id,
      },
      select: {
        id: true,
        telegramId: true,
      },
    });

    const raffle = await prisma.raffle.findUniqueOrThrow({
      where: {
        id: payload.raffleId,
      },
      select: {
        id: true,
        isCompleted: true,
        tasks: true,
        accounts: {
          where: {
            id: account.id,
          },
          select: {
            id: true,
          },
        },
      },
    });

    if (!account.telegramId) throw new Error("INVALID_TELEGRAM_ID");
    if (raffle.isCompleted) throw new Error("RAFFLE_COMPLETED");
    if (raffle.accounts.some((a) => a.id === account.id))
      throw new Error("RAFFLE_PARTICIPANT");

    const isSubscribed = await botService.isUserSubscribed({
      chatId: -1002568311629,
      telegramId: parseInt(account.telegramId),
    });

    if (!isSubscribed) throw new Error("TASK_1");

    await tx.raffle.update({
      where: {
        id: raffle.id,
      },
      data: {
        accounts: {
          connect: {
            id: account.id,
          },
        },
      },
    });
  });
}
