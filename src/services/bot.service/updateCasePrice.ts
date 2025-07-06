import { onTextCallback } from "./utils";
import { tonService } from "../ton.service";

export const updateCasePrice = onTextCallback(
  async (payload, { bot, chatId, prisma }) => {
    if (!payload.match || !payload.match[1] || !payload.match[2]) {
      bot.sendMessage(
        chatId,
        "Некорректный формат команды. Используйте: /update {title} {price}"
      );
      return;
    }

    const price = parseFloat(payload.match[2]);
    let title = payload.match[1].trim();
    if (title.startsWith('"') && title.endsWith('"')) {
      title = title.slice(1, -1);
    } else if (title.startsWith("'") && title.endsWith("'")) {
      title = title.slice(1, -1);
    }

    const g_case = await prisma.gift_case.findFirst({
      where: {
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        price: true,
        starPrice: true,
      },
    });

    if (!g_case) {
      await bot.sendMessage(
        chatId,
        `Кейс с таким названием не найден (${title})`
      );
      return;
    }

    const updated_gift_cases = await tonService.calculateCaseStarPrices([
      g_case,
    ]);

    for (const gift_case of updated_gift_cases) {
      await prisma.gift_case.update({
        where: {
          id: gift_case.id,
        },
        data: {
          starPrice: gift_case.starPrice,
        },
      });
    }

    const updated = await prisma.gift_case.update({
      where: {
        id: g_case.id,
      },
      data: {
        price,
      },
      select: {
        title: true,
        price: true,
      },
    });

    return updated;
  }
);
