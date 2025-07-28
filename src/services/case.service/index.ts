import { nft, Prisma } from "@prisma/client";

const caseWithGifts = Prisma.validator<Prisma.gift_caseDefaultArgs>()({
  include: { gifts: true },
});
type CaseWithGifts = Prisma.gift_caseGetPayload<typeof caseWithGifts>;

export const allowedFirstCaseIds = [
  "4e5f6g7h-8i9j-0k1l-2m3n-4o5p6q7r8s9t", // Big Tease
  "6g5h4i3j-2k1l-0m9n-8o7p-6q5r4s3t2u1v", // Dreamy Mix
  "5b2c9d8e-1f3a-47e8-b6d5-0c4a3b2e1d9f", // Standard
  "7d0eb1d0-0302-46fb-9f61-ad7a421d66ac", // First Shot
  "1b2c3d4e-5f6g-7h8i-9j0k-1l2m3n4o5p6q", // Golden Dream
  "3a8e7b2c-4d5f-49a1-b7c6-2f3e1d0c9b8a", // Basic
  "1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p", // Mystery Box
];

export const freeCase = [
  {
    id: "bfe33858-493d-4749-b0da-286befeef436",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 20,
  },
  {
    id: "b54bdd24-9a0d-4c5c-9b30-02454d7359eb",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 15,
  },
  {
    id: "61af03dd-f1b8-48fa-a320-804c039e6019",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 10,
  },
  {
    id: "a487146d-d60b-4fa2-a6b8-62070983943f",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 7.5,
  },
  {
    id: "04cea21d-8c1d-42e2-9ee3-8a15a8c68104",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 5,
  },
  {
    id: "28f8e3bc-4902-4286-88b2-0e417a1b1114",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 2.5,
  },
  {
    id: "90428bff-5f9d-45b1-8510-d50b0c80fd44",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 1,
  },
  {
    id: "b29c1950-9cfd-4cc8-9b3f-362afaae2ef7",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 0.8,
  },
  {
    id: "fcca98ce-a585-4b6b-b916-e81316f883ae",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 0.6,
  },
  {
    id: "cc8144a4-ae71-410c-898c-7484c01ffc08",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 0.4,
  },
  {
    id: "67b3a71f-0fe9-4e76-9de8-c25334b966c6",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 0.2,
  },
  {
    id: "352d515c-70df-4dd7-8f26-4306de7acc32",
    createdAt: new Date(),
    updatedAt: new Date(),
    title: "TON",
    sku: "ton",
    price: 0.1,
  },
];

export const influenceIds = ["9f7f7b59-cde8-4c24-b329-fbee95acd09d"];

export class CaseService<
  T extends Pick<nft, "id" | "price" | "sku" | "title">,
> {
  public static TON_GIFT = "ton";

  private static EXPONENT = 2;

  public open(nfts: T[], exponent?: number): T {
    const gifts = this.calculateOdds(nfts, exponent);
    const totalRate = gifts.reduce((sum, gift) => sum + gift.odds, 0);
    const rand = Math.random() * totalRate;

    let cumulative = 0;
    for (const gift of gifts) {
      cumulative += gift.odds;
      if (rand < cumulative) {
        return gift;
      }
    }

    return nfts[nfts.length - 1];
  }

  public calculateOdds(
    nfts: T[],
    exponent = CaseService.EXPONENT,
  ): (T & { odds: number })[] {
    const weights = nfts.map((nft) => 1 / Math.pow(nft.price, exponent));
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);

    return nfts.map((nft, i) => ({
      ...nft,
      odds: +((weights[i] / totalWeight) * 100).toFixed(2),
    }));
  }

  public calculatePrice(nfts: T[], margin: number): number {
    const gifts = this.calculateOdds(nfts);
    return (
      +gifts
        .reduce((sum, gift) => sum + gift.price * (gift.odds / 100), 0)
        .toFixed(2) *
      (1 + margin)
    );
  }

  public static async analytics(prisma: Context["prisma"]) {
    const cases = await prisma.gift_case.findMany({
      include: {
        gifts: true,
      },
    });

    return cases.map((g_case) => {
      const price = caseService.calculatePrice(g_case.gifts, 0);
      const price_50 = caseService.calculatePrice(g_case.gifts, 0.5);
      return {
        case: g_case.title,
        price: g_case.price,
        price_0_margin: price,
        price_50_margin: price_50,
      };
    });
  }

  public static async jsonAnalytics(cases: CaseWithGifts[]) {
    return cases.map((g_case) => {
      const price = caseService.calculatePrice(g_case.gifts, 0);
      const price_20 = caseService.calculatePrice(g_case.gifts, 0.2);
      const price_50 = caseService.calculatePrice(g_case.gifts, 0.5);
      return {
        case: g_case.title,
        price: g_case.price,
        price_0_margin: price,
        price_20_margin: price_20,
        price_50_margin: price_50,
      };
    });
  }
}

export const caseService = Object.freeze(new CaseService());
