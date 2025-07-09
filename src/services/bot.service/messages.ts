import { Language, transaction } from "@prisma/client";
import { numberToString } from "@/utils/number";
import TelegramBot from "node-telegram-bot-api";
import { config } from "@/config";

const WelcomeMessageByLanguage: Record<Language, string> = {
  [Language.EN]: `you are a legend! 🎉

🎁 Gifts don’t wait. Open. Win. Repeat.
🎮 GoGift — where surprises drop daily.`,
  [Language.RU]: `ты легенда! 🎉

🎁 Подарки не ждут. Открывай. Выигрывай. Повторяй.
🎮 GoGift — здесь сюрпризы каждый день.`,
};

export const welcomeMessage = (
  name: string,
  language: Language = Language.EN,
) =>
  `🎉 ${name.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1")}, ${
    WelcomeMessageByLanguage[language]
  }`;

export const welcomeMessageOptions = (
  language: Language,
  referral?: string,
): TelegramBot.SendMessageOptions => {
  const startText = language === Language.RU ? "Начать" : "Start";
  const joinChannelText =
    language === Language.RU ? "Вступить в канал" : "Join Channel";
  const supportText = language === Language.RU ? "Поддержка" : "Support";

  return {
    parse_mode: "Markdown",
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: startText,
            url: `https://t.me/${config.bot.name}`,
          },
        ],
        [
          {
            text: joinChannelText,
            url: "https://t.me/GoGift_announcements",
          },
        ],
        [
          {
            text: supportText,
            url: "https://t.me/GoGift_Support",
          },
        ],
      ],
    },
  };
};

export const depositTransactionMessage = (language: Language) => {
  if (language === Language.RU)
    return (transaction: Pick<transaction, "amount">) =>
      `✅ Транзакция завершена! ${numberToString(
        transaction.amount,
      )} TON успешно зачислено на ваш баланс.`;

  return (transaction: Pick<transaction, "amount">) =>
    `✅ Transaction complete. Amount of ${numberToString(
      transaction.amount,
    )} TON has been added to your balance.`;
};

export const successTransactionMessage = (language: Language) => {
  if (language === Language.RU) {
    return (transaction: Pick<transaction, "amount" | "address">) =>
      `✅ Транзакция создана! ${numberToString(
        transaction.amount,
      )} TON отправлено на ваш кошелёк (${transaction.address}).`;
  }

  return (transaction: Pick<transaction, "amount" | "address">) =>
    `✅ Transaction created! Amount of ${numberToString(
      transaction.amount,
    )} TON has been send to your wallet (${transaction.address}).`;
};

export const failedTransactionMessage = (language: Language) => {
  if (language === Language.RU) {
    return (transaction: Pick<transaction, "amount">) =>
      `❌ Транзакция отклонена! ${numberToString(
        transaction.amount,
      )} TON зачислены на ваш баланс.`;
  }

  return (transaction: Pick<transaction, "amount">) =>
    `❌ Transaction Declined! Amount of ${numberToString(
      transaction.amount,
    )} TON has been added to your balance.`;
};

export const failedGiftTransactionMessage = (language: Language) => {
  if (language === Language.RU)
    return (title?: string) =>
      `⚠️ Вывод подарка${
        title ? ` (${title})` : ""
      } отклонен. Мы вернули его в ваш инвентарь. Проверьте условия вывода.`;

  return (title?: string) =>
    `⚠️ Gift${
      title ? ` (${title})` : ""
    } withdraw Declined! We've returned it to your inventory. Review the withdrawal terms.`;
};

export const paySupportMessage = (language: Language) => {
  if (language === Language.RU) {
    return `ℹ️ Важная информация:
Согласно нашей политике, после открытия кейса (получения содержимого) возврат средств не предусмотрен.

Если у вас возникли вопросы по оплате, статусу заказа или работе сервиса — наша команда поддержки всегда готова помочь!
📨 Пишите нам: @GoGift_Support`;
  }

  return `ℹ️ Important Information:
According to our policy, refunds are not provided after the case has been opened (contents received).

If you have any questions regarding payment, order status, or the service — our support team is always ready to help!
📨 Contact us: @GoGift_Support`;
};
