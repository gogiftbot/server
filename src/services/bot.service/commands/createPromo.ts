import { onTextCallback } from "../utils";

export const createPromo = onTextCallback(
  async (payload, { bot, chatId, prisma }) => {
    if (!payload.match || !payload.match[1] || !payload.match[2]) {
      bot.sendMessage(
        chatId,
        "Некорректный формат команды. Используйте: /promo {title} {bonus}",
      );
      return;
    }

    const bonus = parseFloat(payload.match[2]);
    let title = payload.match[1].trim();
    if (title.startsWith('"') && title.endsWith('"')) {
      title = title.slice(1, -1);
    } else if (title.startsWith("'") && title.endsWith("'")) {
      title = title.slice(1, -1);
    }

    const promo = await prisma.promo_code.findUnique({
      where: {
        value: title,
      },
    });

    if (promo) {
      await bot.sendMessage(
        chatId,
        `Promo с таким названием уже сть(${title})`,
      );
      return;
    }

    if (bonus <= 0) {
      await bot.sendMessage(chatId, `Promo bonus <= 0 (${bonus})`);
      return;
    }

    return prisma.promo_code.create({
      data: {
        value: title,
        bonusValue: bonus,
        uses: 100,
      },
    });
  },
);
