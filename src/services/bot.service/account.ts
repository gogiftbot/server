import { onTextCallback } from "./utils";
import { numberToString } from "@/utils/number";
import {
  Prisma,
  TransactionCurrency,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";

const getTransactions = async (prisma: Context['prisma'], options: {
  accountId: string;
  type?: TransactionType;
  currency?: TransactionCurrency;
  dateGte?: Date;
  status?: TransactionStatus[];
}) => {
  const where: Prisma.transactionFindManyArgs["where"] = {
    accountId: options.accountId,
    status: {
      in: options.status || ["completed"],
    },
    ...(options.currency === "star"
      ? {
          accountGift: {
            isNot: null,
          },
        }
      : {}),
  };

  if (options.accountId) {
    where.accountId = options.accountId;
  }

  if (options.type) {
    where.type = options.type;
  }

  if (options.currency) {
    where.currency = options.currency;
  }

  const txs = await prisma.transaction.findMany({
    where,
    select: {
      amount: true,
    },
  });

  const total = txs.reduce((t, tx) => t + tx.amount, 0);

  return `${numberToString(total)} ${options?.currency}`;
};

export const getAccount = onTextCallback(async (payload, { bot, chatId, prisma }) => {
  if (!payload.match || !payload.match[1]) {
    bot.sendMessage(
      chatId,
      "Некорректный формат команды. Используйте: /account {username}"
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

  const data = {
    username,
    balance: numberToString(account.balance),
    ref: {
      value: account.referral?.value,
      percent: account.referral?.percent,
    },
    inventory: numberToString(
      account.gifts.reduce((total, gift) => total + gift.price, 0)
    ),
    deposit: {
      ton: await getTransactions(prisma, {
        accountId: account.id,
        type: TransactionType.deposit,
        currency: TransactionCurrency.ton,
      }),
      star: await getTransactions(prisma,{
        accountId: account.id,
        type: TransactionType.deposit,
        currency: TransactionCurrency.star,
        status: ["completed", "pending"],
      }),
    },
    withdraw: await getTransactions(prisma,{
      accountId: account.id,
      type: TransactionType.withdraw,
      currency: TransactionCurrency.ton,
    }),
  };

  return data;
});
