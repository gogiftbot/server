import { onTextCallback } from "./utils";

export const blockAccount = onTextCallback(async (payload, { bot, chatId, prisma }) => {
  if (!payload.match || !payload.match[1]) {
    bot.sendMessage(
      chatId,
      "Некорректный формат команды. Используйте: /block '{username}'"
    );
    return;
  }

  let username = payload.match[1].trim();
  if (username.startsWith('"') && username.endsWith('"')) {
    username = username.slice(1, -1);
  } else if (username.startsWith("'") && username.endsWith("'")) {
    username = username.slice(1, -1);
  }

  const account = await prisma.account.findFirst({
    where: {
      username: {
        equals: username,
        mode: "insensitive",
      },
    },
    include: {
      gifts: true,
      referral: true,
    },
  });

  if (!account) {
    await bot.sendMessage(
      chatId,
      `Пользователь с таким username не найден (${username})`
    );
    return;
  }

  await prisma.account.update({
    where: {
      id: account.id,
    },
    data: {
      isBlocked: true,
    },
  });

  return {
    username: account.username,
    isBlocked: true,
  };
});
