import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: ".env" });

export enum NODE_ENV {
  development = "development",
  production = "production",
}

const envSchema = z.object({
  NODE_ENV: z.enum([NODE_ENV.development, NODE_ENV.production]),
  PORT: z.coerce
    .number()
    .positive()
    .max(65536, `options.port should be >= 0 and < 65536`),
  HOSTNAME: z.string().url(),

  BOT_API_KEY: z.string(),
  TON_MNEMONIC: z.string(),
  TON_CENTER_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);

const config = {
  HOSTNAME: env.HOSTNAME,
  host: `${env.HOSTNAME}/api`,
  PORT: env.PORT,
  bot: {
    apiKey: env.BOT_API_KEY,
  },
  ton: {
    mnemonic: env.TON_MNEMONIC,
    center: {
      apiKey: env.TON_CENTER_API_KEY,
    },
  },
} as const;

export { config };
