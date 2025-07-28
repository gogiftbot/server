import { config } from "@/config";
import UserAgent from "user-agents";

export const mapper: Record<string, string> = {
  "Xmas Stocking": "xmasstocking",
  "Swiss Watch": "swisswatch",
  "Top Hat": "tophat",
  "Astral Shard": "astralshard",
  "Bday Candle": "bdaycandle",
  "Berry Box": "berrybox",
  "Bunny Muffin": "bunnymuffin",
  "Candy Cane": "candycane",
  "Cookie Heart": "cookieheart",
  "Desk Calendar": "deskcalendar",
  "Crystal Ball": "crystalball",
  "Diamond Ring": "diamondring",
  "Durov's Cap": "durovscap",
  "Genie Lamp": "genielamp",
  "Ginger Cookie": "gingercookie",
  "Hanging Star": "hangingstar",
  "Ion Gem": "iongem",
  "Jack In The Box": "jackinthebox",
  "Kissed Frog": "kissedfrog",
  "Love Potion": "lovepotion",
  "Lunar Snake": "lunarsnake",
  "Magic Potion": "magicpotion",
  "Mini Oscar": "minioscar",
  "Neko Helmet": "nekohelmet",
  "Perfume Bottle": "perfumebottle",
  "Record Player": "recordplayer",
  "Sakura Flower": "sakuraflower",
  "Santa Hat": "santahat",
  "Scared Cat": "scaredcat",
  "Sharp Tongue": "sharptongue",
  "Signet Ring": "signetring",
  "Snake Box": "snakebox",
  "Snow Globe": "snowglobe",
  "Toy Bear": "toybear",
  "Trapped Heart": "trappedheart",
  "Vintage Cigar": "vintagecigar",
  "Plush Pepe": "plushpepe",
  "Voodoo Doll": "voodoodoll",
  "Star Notepad": "starnotepad",
  "Electric Skull": "electricskull",
  "Eternal Rose": "eternalrose",
  "Lol Pop": "lolpop",
  "Precious Peach": "preciouspeach",
  "Witch Hat": "witchhat",
  "Evil Eye": "evileye",
  "Loot Bag": "lootbag",
  "Heart Locket": "heartlocket",
  "Bow Tie": "bowtie",
  "Flying Broom": "flyingbroom",
  "Gem Signet": "gemsignet",
  "Heroic Helmet": "heroichelmet",
  "Light Sword": "lightsword",
  "Love Candle": "lovecandle",
  "Restless Jar": "restlessjar",
  "Cupid Charm": "cupidcharm",
  "Joyful Bundle": "joyfulbundle",
  "Valentine Box": "valentinebox",
};

export const shortNameMapper: Record<string, string> = {
  astralshard: "Astral Shard",
  bdaycandle: "B-Day Candle",
  berrybox: "Berry Box",
  bigyear: "Big Year",
  bondedring: "Bonded Ring",
  bunnymuffin: "Bunny Muffin",
  candycane: "Candy Cane",
  cookieheart: "Cookie Heart",
  crystalball: "Crystal Ball",
  deskcalendar: "Desk Calendar",
  diamondring: "Diamond Ring",
  durovscap: "Durov's Cap",
  easteregg: "Easter Egg",
  electricskull: "Electric Skull",
  eternalcandle: "Eternal Candle",
  eternalrose: "Eternal Rose",
  evileye: "Evil Eye",
  genielamp: "Genie Lamp",
  gingercookie: "Ginger Cookie",
  hangingstar: "Hanging Star",
  hexpot: "Hex Pot",
  holidaydrink: "Holiday Drink",
  homemadecake: "Homemade Cake",
  hypnolollipop: "Hypno Lollipop",
  iongem: "Ion Gem",
  jackinthebox: "Jack-in-the-Box",
  jellybunny: "Jelly Bunny",
  jesterhat: "Jester Hat",
  jinglebells: "Jingle Bells",
  kissedfrog: "Kissed Frog",
  lolpop: "Lol Pop",
  lootbag: "Loot Bag",
  lovepotion: "Love Potion",
  lunarsnake: "Lunar Snake",
  lushbouquet: "Lush Bouquet",
  madpumpkin: "Mad Pumpkin",
  magicpotion: "Magic Potion",
  minioscar: "Mini Oscar",
  nailbracelet: "Nail Bracelet",
  nekohelmet: "Neko Helmet",
  partysparkler: "Party Sparkler",
  perfumebottle: "Perfume Bottle",
  petsnake: "Pet Snake",
  plushpepe: "Plush Pepe",
  preciouspeach: "Precious Peach",
  recordplayer: "Record Player",
  sakuraflower: "Sakura Flower",
  santahat: "Santa Hat",
  scaredcat: "Scared Cat",
  sharptongue: "Sharp Tongue",
  signetring: "Signet Ring",
  skullflower: "Skull Flower",
  sleighbell: "Sleigh Bell",
  snakebox: "Snake Box",
  snowglobe: "Snow Globe",
  snowmittens: "Snow Mittens",
  spicedwine: "Spiced Wine",
  spyagaric: "Spy Agaric",
  starnotepad: "Star Notepad",
  swisswatch: "Swiss Watch",
  tamagadget: "Tama Gadget",
  tophat: "Top Hat",
  toybear: "Toy Bear",
  trappedheart: "Trapped Heart",
  vintagecigar: "Vintage Cigar",
  voodoodoll: "Voodoo Doll",
  winterwreath: "Winter Wreath",
  witchhat: "Witch Hat",
  xmasstocking: "Xmas Stocking",
  heartlocket: "Heart Locket",
  bowtie: "Bow Tie",
  flyingbroom: "Flying Broom",
  gemsignet: "Gem Signet",
  heroichelmet: "Heroic Helmet",
  lightsword: "Light Sword",
  lovecandle: "Love Candle",
  restlessjar: "Restless Jar",
  cupidcharm: "Cupid Charm",
  joyfulbundle: "Joyful Bundle",
  valentinebox: "Valentine Box",
};

const Authorization =
  "tma query_id=AAEtdsReAwAAAC12xF5bpjAU&user=%7B%22id%22%3A8032384557%2C%22first_name%22%3A%22GoGift%20Relayer%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22GoGift_Relayer%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FrIzkEK_z92hCbg0Q5cMj5oAIbkMctujmsZriOjWTsp5KQcaluaYdrR6DUm_AdMDZ.svg%22%7D&auth_date=1750579920&signature=iVKOYT0wyv-1XznLtNbhV7_XYo2rY0qXh9KmKEvOacW4mVgnYUV0V651Jv1BLTyPxcmIApwVIo5YBrQT44u2Bw&hash=4ef56b0e3b079a55d77d8c8b174a0fde94cebdcd1643ee5256b148ebbc6bc8f8";

export class MarketplaceService {
  async updatePrices(prisma: Context["prisma"]) {
    const prices = await this.fetchPrices(prisma);

    const data = prices
      .filter((price) => price.new !== price.old)
      .map((price) => ({ id: price.id, price: price.new }));

    for (const nft of data) {
      await prisma.nft.update({
        where: {
          id: nft.id,
        },
        data: {
          price: nft.price,
        },
      });
    }
  }

  async fetchPrices(prisma: Context["prisma"]) {
    const nfts = await prisma.nft.findMany({
      where: {
        title: {
          not: "TON",
        },
      },
      orderBy: { price: "asc" },
    });

    const prices = await this.getPrices();

    const data: { id: string; title: string; new: number; old: number }[] = [];
    for (const nft of nfts) {
      const price = prices[mapper[nft.title]];
      if (!price) {
        console.log(nft.title, mapper[nft.title], nft.price, price);
      } else {
        const floatPrice = +parseFloat(price).toFixed(2);
        data.push({
          id: nft.id,
          title: nft.title,
          new: floatPrice,
          old: nft.price,
        });
      }
    }

    return data;
  }

  public async getGiftToWithdraw(
    payload: { title: string },
    afterPurchase = false,
  ): Promise<{ id: string; price: string }> {
    try {
      const gift = await marketplaceService.getGiftFromInventory({
        title: payload.title,
      });

      if (gift) return gift;
      if (afterPurchase) throw new Error("SOMETHING_BAD");

      const giftFromAuction = await this.getGiftFromAuction({
        title: payload.title,
      });
      await marketplaceService.purchase({
        id: giftFromAuction.id,
        price: giftFromAuction.price,
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      return this.getGiftToWithdraw(payload, true);
    } catch (error) {
      console.error("getGiftToWithdraw", (error as Error).message);
      throw error;
    }
  }

  async preview(): Promise<Record<string, string>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000); // 15 seconds

    try {
      const res = await fetch(
        `https://portals-market.com/api/collections/filters/preview`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization,
            "User-Agent": new UserAgent().data.userAgent,
          },
          signal: controller.signal,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("preview", data);
        throw new Error(`BadRequest`);
      }

      return data as Record<string, string>;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async purchase(payload: { id: string; price: string }): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000); // 15 seconds

    try {
      const res = await fetch(`https://portals-market.com/api/nfts`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization,
          "User-Agent": new UserAgent().data.userAgent,
        },
        body: JSON.stringify({
          nft_details: [
            {
              id: payload.id,
              price: payload.price,
            },
          ],
        }),
        signal: controller.signal,
      });

      if (!res.ok) {
        console.error("purchase");
        throw new Error(`BadRequest`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async sendGift(payload: { id: string; recipient: number }): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000);

    try {
      const res = await fetch(
        `https://portals-market.com/partners/nfts/withdraw`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Authorization: `partners ${config.integration.portals.apiKey}`,
          },
          body: JSON.stringify({
            gift_ids: [payload.id],
            recipient_id: payload.recipient,
            unsafe_transfer: false,
          }),
          signal: controller.signal,
        },
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("sendGift", data);
        throw new Error(res.statusText);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async isPortalUser(telegramId: string | number) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000); // 15 seconds

    try {
      const res = await fetch(
        `https://portals-market.com/partners/users/${telegramId}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `partners ${config.integration.portals.apiKey}`,
          },
        },
      );

      const data = (await res.json()) as { exists?: boolean };
      if (!data.exists) throw new Error("NO_ACCOUNT");

      return true;
    } catch (_error) {
      return false;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getGiftFromInventory(payload: {
    title: string;
  }): Promise<{ id: string; price: string } | undefined> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000); // 15 seconds

    const shortname = mapper[payload.title];
    if (!shortname) throw new Error("INVALID_SHORTNAME");

    const title = shortNameMapper[shortname];
    if (!title) throw new Error("INVALID_TITLE");

    try {
      const res = await fetch(
        `https://portals-market.com/api/nfts/owned?offset=0&limit=1&filter_by_collections=${title}&sort_by=price+asc&status=unlisted`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization,
            "User-Agent": new UserAgent().data.userAgent,
          },
          signal: controller.signal,
        },
      );

      const data = (await res.json()) as {
        nfts: { id: string; price: string }[];
      };

      if (!res.ok) {
        console.error("getGiftFromInventory", data);
        throw new Error(`BadRequest`);
      }

      return data.nfts[0];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getGiftFromAuction(payload: { title: string }) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10_000); // 15 seconds

    const shortname = mapper[payload.title];
    if (!shortname) throw new Error("INVALID_SHORTNAME");

    const title = shortNameMapper[shortname];
    if (!title) throw new Error("INVALID_TITLE");

    try {
      const res = await fetch(
        `https://portals-market.com/api/nfts/search?offset=0&limit=1&filter_by_collections=${title.replaceAll(
          " ",
          "+",
        )}&sort_by=price+asc&status=listed`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization,
            "User-Agent": new UserAgent().data.userAgent,
          },
          signal: controller.signal,
        },
      );

      const data = (await res.json()) as {
        results: { id: string; price: string }[];
      };

      if (!res.ok) {
        console.error("getGiftFromAuction", data);
        throw new Error(`BadRequest`);
      }

      if (!data.results[0]?.id) throw new Error("INVALID_GIFT");

      return data.results[0];
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async getPrices(): Promise<Record<string, string>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15_000); // 15 seconds

    try {
      const res = await fetch(
        "https://portals-market.com/api/collections/floors",
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization,
            "User-Agent": new UserAgent().data.userAgent,
          },
          signal: controller.signal,
        },
      );

      const data = (await res.json()) as {
        floorPrices: Record<string, string>;
      };

      if (!res.ok) {
        console.error("getPrices", data);
        throw new Error(`BadRequest`);
      }

      return data.floorPrices;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

export const marketplaceService = Object.freeze(new MarketplaceService());
