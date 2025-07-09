import { onTextCallback } from "../utils";

export const updateRef = onTextCallback(
  async (payload, { bot, chatId, prisma }) => {
    if (!payload.match || !payload.match[1]) {
      bot.sendMessage(
        chatId,
        "Некорректный формат команды. Используйте: /updateRef '{ref_value}' amount",
      );
      return;
    }

    const amount = parseFloat(payload.match[2]);
    let ref_value = payload.match[1].trim();
    if (ref_value.startsWith('"') && ref_value.endsWith('"')) {
      ref_value = ref_value.slice(1, -1);
    } else if (ref_value.startsWith("'") && ref_value.endsWith("'")) {
      ref_value = ref_value.slice(1, -1);
    }

    const referral = await prisma.referral.findFirst({
      where: {
        value: ref_value,
      },
      include: {
        account: true,
      },
    });

    if (!referral) {
      await bot.sendMessage(chatId, `Рефералка не найдена (${ref_value})`);
      return;
    }

    await prisma.referral.update({
      where: {
        id: referral.id,
      },
      data: {
        percent: amount,
      },
    });

    return { username: referral.account.username, ref_value, amount };
  },
);
