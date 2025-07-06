import { onTextCallback } from "./utils";
import { numberToString } from "@/utils/number";

export const ref = onTextCallback(async ({}, {prisma}) => {
  const accounts = await prisma.account.findMany({
    select: {
      id: true,
      transactions: {
        select: {
          id: true,
          amount: true,
          type: true,
          status: true,
          currency: true,
          account_giftId: true,
        },
      },
      referredBy: {
        select: {
          account: {
            select: {
              username: true,
            },
          },
        },
      },
    },
  });

  const obj: Record<
    string,
    {
      username: string;
      accounts: number;
      ton: number;
      star: number;
      withdraw: number;
    }
  > = {};

  for (const acc of accounts) {
    const username = acc.referredBy?.account.username || "unknown";
    if (!obj[username]) {
      obj[username] = {
        username,
        accounts: 0,
        ton: 0,
        star: 0,
        withdraw: 0,
      };
    }
    const ton = acc.transactions
      .filter(
        (tx) =>
          tx.status === "completed" &&
          tx.type === "deposit" &&
          tx.currency === "ton"
      )
      .reduce((t, tx) => t + tx.amount, obj[username].ton);
    const star = acc.transactions
      .filter(
        (tx) =>
          (tx.status === "completed" || tx.status === "pending") &&
          tx.type === "deposit" &&
          tx.currency === "star" &&
          !!tx.account_giftId
      )
      .reduce((t, tx) => t + tx.amount, obj[username].star);

    const withdraw = acc.transactions
      .filter((tx) => tx.status === "completed" && tx.type === "withdraw")
      .reduce((t, tx) => t + tx.amount, obj[username].withdraw);

    obj[username] = {
      username,
      accounts: obj[username].accounts + 1,
      ton,
      star,
      withdraw,
    };
  }

  const arr = Object.values(obj)
    .filter((o) => !!o.accounts)
    .sort((a, b) => b.accounts - a.accounts)
    .slice(0, 10)
    .map((item) => ({
      ...item,
      ton: numberToString(item.ton),
      star: numberToString(item.star),
      withdraw: numberToString(item.withdraw),
    }));

  return arr;
});
