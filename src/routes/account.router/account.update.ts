import { Language } from '@prisma/client'

export async function AccountUpdate(prisma: Context['prisma'], acc: Express.Request['account'], payload: { language: Language }) {
  if (![Language.EN, Language.RU].includes(payload.language)) {
    throw new Error('InvalidLanguage')
  }

  await prisma.$transaction(async (tx) => {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: acc?.id
      },
    });

    await tx.account.update({
      where: {
        id: account.id,
      },
      data: {
        language: payload.language,
      },
    });
  });
}
