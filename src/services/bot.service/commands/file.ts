import { onFileCallback } from "../utils";
import { config } from "@/config";
import { CaseService } from "@/services/case.service";
import { numberToString } from "@/utils/number";

export const onFileUpload = onFileCallback(async ({ message }, { bot }) => {
  const document = message.document;

  if (!document) {
    throw new Error("Файл не найден.");
  }

  const fileId = document.file_id;
  const fileName = document.file_name;

  if (!fileName?.endsWith(".json")) {
    throw new Error("Пожалуйста, отправьте JSON-файл.");
  }

  const file = await bot.getFile(fileId);
  const fileUrl = `https://api.telegram.org/file/bot${config.bot.apiKey}/${file.file_path}`;

  const response = await fetch(fileUrl, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });

  const jsonData = await response.json();

  const analytics = await CaseService.jsonAnalytics(jsonData as any);

  return analytics.map((item) => ({
    case: item.case,
    price: `${numberToString(item.price)} TON`,
    margin: `${numberToString(
      ((item.price - item.price_0_margin) / item.price_0_margin) * 100,
    )}%`,
    "(0%)": `${numberToString(item.price_0_margin)} TON`,
    "(20%)": `${numberToString(item.price_20_margin)} TON`,
    "(50%)": `${numberToString(item.price_50_margin)} TON`,
  }));
});
