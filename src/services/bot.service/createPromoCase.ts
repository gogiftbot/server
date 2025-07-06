import { onTextCallback } from "./utils";

export const createPromoCase = onTextCallback(
  async (payload, { bot, chatId, prisma }) => {
    if (!payload.match || !payload.match[1] || !payload.match[2]) {
      bot.sendMessage(
        chatId,
        "Некорректный формат команды. Используйте: /promo {title} {keys}"
      );
      return;
    }

    const keys = parseFloat(payload.match[2]);
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
        `Promo с таким названием уже сть(${title})`
      );
      return;
    }

    if (keys <= 0) {
      await bot.sendMessage(chatId, `Promo keys <= 0 (${keys})`);
      return;
    }

    return prisma.promo_code.create({
      data: {
        value: title,
        uses: keys,
        isFreeCase: true,
      },
    });
  }
);
