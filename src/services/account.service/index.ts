import retry from "async-retry";
import {
  Language,
  transaction,
  TransactionCurrency,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { ReferralService } from "../referral.service";
import { BotService } from "../bot.service";
import { marketplaceService } from "../marketplace.service";
import { failedGiftTransactionMessage } from "../bot.service/messages";
import { numberToString } from "@/utils/number";
import { tonService } from "../ton.service";

const foo = (
  type: TransactionType,
  currency: TransactionCurrency,
  txs: transaction[] = [],
) =>
  txs
    .filter(
      (tx) =>
        tx.status === TransactionStatus.completed &&
        tx.type === type &&
        tx.currency === currency,
    )
    .reduce((total, tx) => total + tx.amount, 0);

export class AccountService {
  private readonly referralService: ReferralService;
  private readonly botService: BotService;

  constructor(private readonly prisma: Context["prisma"]) {
    this.referralService = new ReferralService();
    this.botService = new BotService(this.prisma);
  }

  public async getAccountStatistics(accountId: string) {
    const account = await this.prisma.account.findUniqueOrThrow({
      where: {
        id: accountId,
      },
      select: {
        username: true,
        balance: true,
        gifts: {
          where: {
            isWithdraw: false,
            isSold: false,
          },
          select: {
            price: true,
          },
        },
        transactions: {
          include: {
            accountGift: true,
          },
        },
      },
    });

    return {
      username: account.username,
      balance: numberToString(account.balance),
      inventory: numberToString(
        account.gifts.reduce((total, gift) => total + gift.price, 0),
      ),
      deposit: {
        ton: numberToString(
          foo(
            TransactionType.deposit,
            TransactionCurrency.ton,
            account.transactions,
          ),
        ),
        star: account.transactions
          .filter(
            (tx) =>
              (
                [
                  TransactionStatus.completed,
                  TransactionStatus.pending,
                ] as string[]
              ).includes(tx.status) &&
              TransactionCurrency.star === tx.currency &&
              TransactionType.deposit === tx.type &&
              !!tx.accountGift,
          )
          .reduce((total, tx) => total + tx.amount, 0),
      },
      withdraw: numberToString(
        foo(
          TransactionType.withdraw,
          TransactionCurrency.ton,
          account.transactions,
        ),
      ),
    };
  }

  public async withdraw(payload: { transactionId: string }) {
    const transaction = await this.prisma.transaction.findUniqueOrThrow({
      where: {
        id: payload.transactionId,
      },
      select: {
        amount: true,
        account: {
          select: {
            id: true,
            transactions: {
              where: {
                type: TransactionType.deposit,
                OR: [
                  {
                    currency: TransactionCurrency.ton,
                    status: TransactionStatus.completed,
                  },
                  {
                    currency: TransactionCurrency.star,
                    status: {
                      in: [
                        TransactionStatus.completed,
                        TransactionStatus.pending,
                      ],
                    },
                  },
                ],
              },
            },
            gifts: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });
    const accountData = await this.getAccountStatistics(transaction.account.id);

    const starsInUsd = accountData.deposit.star * 0.013;
    const tonToUsd = await tonService.getExchangeRates();
    const deposit = starsInUsd / tonToUsd + parseFloat(accountData.deposit.ton);

    if (
      !transaction.account.transactions.length ||
      (deposit < parseFloat(accountData.withdraw) &&
        transaction.account.gifts.length > 1) ||
      transaction.amount >= deposit * 1.5
    ) {
      await this.botService.onWithdraw(payload);
      return;
    }

    try {
      try {
        const transaction = await retry(
          async () => {
            return this.prisma.$transaction(async (tx) => {
              const transaction = await tx.transaction.findUniqueOrThrow({
                where: {
                  id: payload.transactionId,
                  status: TransactionStatus.pending,
                },
                select: {
                  id: true,
                  amount: true,
                  accountGift: {
                    select: {
                      nft: true,
                      isSold: true,
                      isWithdraw: true,
                      case: { select: { title: true } },
                    },
                  },
                  account: { select: { id: true, telegramId: true } },
                },
              });

              if (!transaction.accountGift) throw new Error("INVALID_GIFT");
              if (!transaction.account.telegramId)
                throw new Error("INVALID_TELEGRAM_ID");

              await tx.transaction.update({
                where: {
                  id: transaction.id,
                },
                data: {
                  status: TransactionStatus.completed,
                },
              });

              const gift = await marketplaceService.getGiftToWithdraw({
                title: transaction.accountGift.nft.title,
              });

              await marketplaceService.sendGift({
                id: gift.id,
                recipient: transaction.account.telegramId,
              });

              return transaction;
            });
          },
          {
            retries: 3,
          },
        );

        const accountStatistics = await this.getAccountStatistics(
          transaction.account.id,
        );
        const data = Object.assign({}, accountStatistics, {
          id: transaction.id,
          amount: numberToString(transaction.amount),
          title: transaction.accountGift?.nft.title,
          case: transaction.accountGift?.case.title,
        });
        await this.botService.successWithdrawNotification(data);
      } catch (error) {
        const transaction = await this.prisma.$transaction(async (tx) => {
          const transaction = await tx.transaction.update({
            where: {
              id: payload.transactionId,
            },
            data: {
              status: TransactionStatus.declined,
            },
            select: {
              id: true,
              amount: true,
              accountId: true,
              accountGift: {
                select: {
                  id: true,
                  nft: {
                    select: {
                      title: true,
                    },
                  },
                  case: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
              account: { select: { telegramId: true, language: true } },
            },
          });

          if (transaction.accountGift) {
            await tx.account_gift.update({
              where: {
                id: transaction.accountGift.id,
              },
              data: {
                isWithdraw: false,
              },
            });
          }

          if (transaction.account.telegramId) {
            await this.botService.bot
              .sendMessage(
                transaction.account.telegramId,
                failedGiftTransactionMessage(transaction.account.language)(
                  transaction.accountGift?.nft.title,
                ),
              )
              .catch(() => {});
          }

          return transaction;
        });

        const accountStatistics = await this.getAccountStatistics(
          transaction.accountId,
        );
        const data = Object.assign({}, accountStatistics, {
          error: (error as Error).message,
          id: transaction.id,
          amount: numberToString(transaction.amount),
          title: transaction.accountGift?.nft.title,
          case: transaction.accountGift?.case.title,
        });
        await this.botService.failedWithdrawNotification(data);
      }
    } catch (error) {
      await this.botService.internalErrorAlert(
        `${(error as Error).message}:${payload.transactionId}`,
      );
    }
  }

  async authenticateViaTelegram(payload: {
    user: {
      username: string;
      language: Language;
      telegramId: string;
      avatarUrl?: string;
    };
    referral?: string | null;
  }) {
    const data = await this.prisma.$transaction(async (tx) => {
      const account = await this.upsertAccount(tx, {
        ...payload.user,
        referral: payload.referral,
      });

      return account;
    });

    return data;
  }

  private async upsertAccount(
    tx: PrismaTransaction,
    payload: {
      username: string;
      referral?: string | null;
      language?: Language;
      firstName?: string;
      lastName?: string;
      telegramId?: string;
      avatarUrl?: string;
    },
  ) {
    const account = await tx.account.findUnique({
      where: {
        username: payload.username,
      },
      select: { id: true },
    });

    if (account) {
      return tx.account.update({
        where: {
          id: account.id,
        },
        data: {
          avatarUrl: payload.avatarUrl,
          language: payload.language,
          telegramId: payload.telegramId,
        },
      });
    }

    return this.createAccount(tx, payload);
  }

  private async createAccount(
    tx: PrismaTransaction,
    payload: {
      username: string;
      referral?: string | null;
      language?: Language;
      telegramId?: string;
      avatarUrl?: string;
    },
  ) {
    const account = await tx.account.create({
      data: {
        username: payload.username,
        language: payload.language,
        telegramId: payload.telegramId,
        avatarUrl: payload.avatarUrl,
      },
    });

    const referral = await this.referralService.createReferral(tx, {
      accountId: account.id,
      referral: payload.referral,
    });

    if (account.telegramId) {
      await this.botService.onStart({
        username: account.username,
        telegramId: account.telegramId,
        referral: referral.value,
        language: account.language,
      });
    }

    return account;
  }
}
