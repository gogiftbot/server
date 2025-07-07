import crypto from "crypto";
import { config } from '@/config'
import { AccountService } from "@/services/account.service";
import { codeToLanguage } from "@/utils/language";

function checkTelegramAuth(initData: string) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  params.delete("hash");

  const sorted = [...params.entries()].sort(([a], [b]) => a.localeCompare(b));
  const dataCheckString = sorted.map(([k, v]) => `${k}=${v}`).join("\n");

  const secretKey = crypto
    .createHmac("sha256", "WebAppData")
    .update(config.bot.apiKey)
    .digest();
  const computedHash = crypto
    .createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  return computedHash === hash;
}

export async function Authtelegram(prisma: Context['prisma'], payload: { data: string }) {
  if (config.isDevelopment) {
    return {
      accountId: "4fe37b3a-40df-4f97-bfd8-6596e3694c0c",
    }
  }


  if (!checkTelegramAuth(payload.data)) {
    throw new Error('Invalid signature')
  }

  const params = new URLSearchParams(payload.data);
  const user = params.get("user");

  if (!user) {
    throw new Error('Invalid user')
  }

  const parsedUser = <
    {
      id?: number;
      username?: string;
      language_code: string;
      photo_url?: string;
    }
    >JSON.parse(user);

  if (!parsedUser.id) {
    throw new Error('Invalid params')
  }

  const accountsCount = await prisma.account.count({
    where: {
      username: {
        startsWith: "gogift_unknown_",
      },
    },
  });

  const username = parsedUser.username || `gogift_unknown_${accountsCount}`;
  const referral = params.get("start_param");

  const account = await new AccountService(prisma).authenticateViaTelegram({
    referral,
    user: {
      avatarUrl: parsedUser.photo_url,
      telegramId: parsedUser.id.toString(),
      language: codeToLanguage(parsedUser.language_code),
      username,
    },
  });

  return { accountId: account.id }
}
