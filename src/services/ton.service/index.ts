import { AccountEvent, TonApiClient } from "@ton-api/client";
import { Address, fromNano, SendMode, toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV5R1, internal } from "@ton/ton";
import { BonusType, TransactionStatus, TransactionType } from "@prisma/client";
import { config } from "@/config";
import { BotService } from "../bot.service";
import { numberToString } from "@/utils/number";

type DepositTX = {
  from: string;
  amount: number;
  lt: bigint;
  timestamp: number;
  accountId?: string;
  bonusId?: string;
};

export class TonService {
  private readonly address = Address.parse(config.ton.address);
  public readonly tonApi = new TonApiClient({
    baseUrl: "https://tonapi.io",
    apiKey: config.ton.apiKey,
  });
  public readonly tonClient = new TonClient({
    endpoint: "https://toncenter.com/api/v2/jsonRPC",
    apiKey: config.ton.center.apiKey,
  });

  public async onDepositTx(prisma: Context["prisma"]) {
    const transaction = await prisma.ton_transaction.findFirst({
      where: {
        transaction: {
          type: TransactionType.deposit,
        },
      },
      select: {
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const startDate = transaction?.createdAt
      ? Math.floor(transaction?.createdAt.getTime() / 1000)
      : undefined;

    const { events } = await this.tonApi.accounts.getAccountEvents(
      this.address,
      {
        limit: 100,
        start_date: startDate,
      },
    );

    const depositTxs: DepositTX[] = events.flatMap((event) =>
      this.parseEvent({ event }),
    );

    for (const depositTx of depositTxs) {
      try {
        const transaction = await prisma.$transaction(async (tx) => {
          const account = await tx.account.findUniqueOrThrow({
            where: {
              id: depositTx.accountId,
            },
            select: {
              id: true,
              referredBy: {
                select: {
                  accountId: true,
                  percent: true,
                },
              },
              bonuses: {
                where: {
                  isUsed: false,
                  type: BonusType.deposit,
                },
              },
            },
          });

          console.log(
            "from: ",
            depositTx.from,
            "accountId: ",
            account.id,
            "amount: ",
            numberToString(depositTx.amount),
            "bonusId: ",
            depositTx.bonusId,
          );

          if (account.referredBy?.accountId) {
            await tx.account.update({
              where: {
                id: account.referredBy.accountId,
              },
              data: {
                balance: {
                  increment:
                    depositTx.amount * (account.referredBy.percent / 100),
                },
              },
            });
          }

          if (
            depositTx.bonusId &&
            account.bonuses.some((bonus) => bonus.id === depositTx.bonusId)
          ) {
            const bonus = await tx.bonus.update({
              where: {
                id: depositTx.bonusId,
                accountId: account.id,
              },
              data: {
                isUsed: true,
              },
              select: {
                id: true,
                value: true,
              },
            });
            const bonusValue = bonus.value ? 1 + bonus.value / 100 : 1;
            const amount = depositTx.amount * bonusValue;
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
            const transaction = await tx.ton_transaction.create({
              data: {
                from: depositTx.from,
                to: this.address.toString({
                  urlSafe: true,
                  bounceable: false,
                }),
                lt: depositTx.lt.toString(),
                transaction: {
                  create: {
                    amount,
                    accountId: account.id,
                    type: TransactionType.deposit,
                    status: TransactionStatus.completed,
                    bonus: {
                      connect: {
                        id: bonus.id,
                      },
                    },
                  },
                },
              },
            });
            return transaction;
          }

          await tx.account.update({
            where: {
              id: account.id,
            },
            data: {
              balance: {
                increment: depositTx.amount,
              },
            },
          });
          const transaction = await tx.ton_transaction.create({
            data: {
              from: depositTx.from,
              to: this.address.toString({
                urlSafe: true,
                bounceable: false,
              }),
              lt: depositTx.lt.toString(),
              transaction: {
                create: {
                  amount: depositTx.amount,
                  accountId: account.id,
                  type: TransactionType.deposit,
                  status: TransactionStatus.completed,
                },
              },
            },
          });
          return transaction;
        });

        await new BotService(prisma).onDeposit({
          transactionId: transaction.transactionId,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  private parseEvent({ event }: { event: AccountEvent }): DepositTX[] {
    const deposits: DepositTX[] = [];

    for (const action of event.actions) {
      if (action.TonTransfer?.comment && action.TonTransfer?.amount) {
        try {
          const data: { accountId?: string; bonusId?: string } = JSON.parse(
            action.TonTransfer.comment!,
          );

          if (!data.accountId) throw new Error("INVALID_TX_COMMENT");

          deposits.push({
            from: action.TonTransfer.sender.address.toString({
              urlSafe: true,
              bounceable: false,
            }),
            amount: parseFloat(fromNano(action.TonTransfer.amount)),
            lt: BigInt(event.lt),
            timestamp: event.timestamp,
            accountId: data.accountId,
            bonusId: data.bonusId,
          });
        } catch (error: any) {
          console.log(action.TonTransfer, error);
        }
      }
    }

    return deposits;
  }

  public async getAddressBalance(address: string): Promise<string | undefined> {
    try {
      const walletAddress = Address.parse(address);
      const balance = await this.tonClient.getBalance(walletAddress);
      const balanceInTon = Number(balance) / 1e9;

      return balanceInTon.toFixed(2);
    } catch (error) {
      return undefined;
    }
  }

  public async send(payload: { amount: number; address: string }) {
    try {
      if (!config.ton.mnemonic) throw new Error("INVALID_MNEMONIC");
      const mnemonic = config.ton.mnemonic.split(" ");
      const keyPair = await mnemonicToPrivateKey(mnemonic);
      const walletContract = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
      });

      const wallet = this.tonClient.open(walletContract);

      const balance = await this.tonClient.getBalance(wallet.address);
      const amountToSend = toNano(payload.amount);
      const estimatedFee = toNano("0.01");
      if (balance < amountToSend + estimatedFee) {
        throw new Error("INFLUENT_BALANCE");
      }

      const seqno = await wallet.getSeqno();

      await wallet.sendTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [
          internal({
            to: payload.address,
            value: toNano(payload.amount),
          }),
        ],
        sendMode: SendMode.IGNORE_ERRORS,
      });

      return wallet.address.toString({
        urlSafe: true,
        bounceable: false,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getExchangeRates() {
    const url = new URL(`https://min-api.cryptocompare.com/data/price`);

    url.searchParams.append("fsym", "TON");
    url.searchParams.append("tsyms", "USD");
    url.searchParams.append("api_key", config.ton.crypto.apiKey);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch TON/USD exchange rate: ${response.statusText}`,
      );
    }

    const data = (await response.json()) as { USD: number };

    return data.USD;
  }

  public async calculateCaseStarPrices<T extends { price: number }>(
    giftCases: T[],
  ) {
    const tonToUsd = await tonService.getExchangeRates();
    return giftCases.map((giftCase) => {
      const stars = (giftCase.price * tonToUsd) / 0.013;
      return { ...giftCase, starPrice: Math.ceil(stars / 25) * 25 };
    });
  }

  public async updateCasesPriceInStar(prisma: Context["prisma"]) {
    const gift_cases = await prisma.gift_case.findMany({
      select: {
        id: true,
        price: true,
        starPrice: true,
      },
    });

    const updated_gift_cases = await this.calculateCaseStarPrices(gift_cases);

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
  }
}

export const tonService = Object.freeze(new TonService());
