import { Language } from "@prisma/client";

const allowedLanguages: string[] = [Language.EN, Language.RU];

export const codeToLanguage = (code?: string): Language => {
  if (!code) return Language.EN;

  const parsedLanguage = code.toUpperCase();
  if (allowedLanguages.includes(parsedLanguage))
    return <Language>parsedLanguage;

  return Language.EN;
};
