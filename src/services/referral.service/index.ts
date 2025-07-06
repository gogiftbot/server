import crypto from "crypto";

export class ReferralService {
  public async createReferral(
    tx: PrismaTransaction,
    payload: { accountId: string; referral?: string | null }
  ) {
    const value = this.generateValue();

    const referral = await tx.referral.create({
      data: {
        accountId: payload.accountId,
        value,
      },
    });

    if (payload.referral) {
      const referredBy = await tx.referral.findUnique({
        where: {
          value: payload.referral,
        },
        select: {
          id: true,
          account: {
            select: {
              id: true,
            },
          },
        },
      });

      if (referredBy?.id) {
        await tx.account.update({
          where: {
            id: payload.accountId,
          },
          data: {
            referredById: referredBy.id,
          },
        });
      }
    }

    return referral;
  }

  public async getAccountReferrals(
    tx: PrismaTransaction,
    payload: {
      accountId: string;
    }
  ): Promise<string[]> {
    const account = await tx.account.findUniqueOrThrow({
      where: {
        id: payload.accountId,
      },
      select: {
        referral: {
          select: {
            accounts: {
              select: {
                id: true,
              },
            },
          },
        },
      },
    });

    if (!account.referral) return [];

    return account.referral.accounts.map((account) => account.id);
  }

  private generateValue() {
    return crypto
      .randomBytes(9)
      .toString("base64")
      .substring(0, 9)
      .replace(/([^a-zA-Z.0-9]+)/gi, "G");
  }
}
