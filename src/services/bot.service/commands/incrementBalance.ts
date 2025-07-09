import { onTextCallback } from "../utils";
import {
  TransactionCurrency,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

export const incrementBalance = onTextCallback(
  async (payload, { bot, chatId, prisma }) => {
    if (!payload.match || !payload.match[1] || !payload.match[2]) {
      bot.sendMessage(
        chatId,
        "Некорректный формат команды. Используйте: /deposit {username} {amount}",
      );
      return;
    }

    const amount = parseFloat(payload.match[2]);
    let username = payload.match[1].trim();
    if (username.startsWith('"') && username.endsWith('"')) {
      username = username.slice(1, -1);
    } else if (username.startsWith("'") && username.endsWith("'")) {
      username = username.slice(1, -1);
    }

    if (amount <= 0) {
      await bot.sendMessage(chatId, `Сумма должна быть больше 0 (${amount})`);
      return;
    }

    const data = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: {
          username: {
            equals: username,
            mode: "insensitive",
          },
        },
      });

      if (!account) {
        await bot.sendMessage(
          chatId,
          `Пользователь с таким username не найден (${username})`,
        );
        return;
      }

      await tx.transaction.create({
        data: {
          amount,
          accountId: account.id,
          status: TransactionStatus.completed,
          currency: TransactionCurrency.ton,
          type: TransactionType.deposit,
        },
      });

      await tx.account.update({
        where: {
          id: account.id,
        },
        data: {
          balance: {
            increment: amount,
          },
        },
      });

      return { username, amount };
    });

    return data;
  },
);
