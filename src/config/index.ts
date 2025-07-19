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
    .max(65536, `options.PORT should be >= 0 and < 65536`),
  HOSTNAME: z.string().url(),

  REDIS_DOMAIN: z.string(),
  REDIS_PORT: z.coerce
    .number()
    .positive()
    .max(65536, `options.REDIS_PORT should be >= 0 and < 65536`),
  REDIS_USERNAME: z.string().optional(),
  REDIS_PASSWORD: z.string().optional(),

  BOT_API_KEY: z.string(),

  TON_ADDRESS: z.string(),
  TON_MNEMONIC: z.string(),
  TON_API_KEY: z.string(),
  TON_CENTER_API_KEY: z.string(),
  CRYPTO_COMPARE_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);

const config = {
  HOSTNAME: env.HOSTNAME,
  host: `${env.HOSTNAME}/api`,
  PORT: env.PORT,
  isDevelopment: env.NODE_ENV !== NODE_ENV.production,
  redis: {
    domain: env.REDIS_DOMAIN,
    port: env.REDIS_PORT,
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
  },
  bot: {
    apiKey: env.BOT_API_KEY,
    name: "GoGift_official_bot",
  },
  ton: {
    address: env.TON_ADDRESS,
    mnemonic: env.TON_MNEMONIC,
    apiKey: env.TON_API_KEY,
    center: {
      apiKey: env.TON_CENTER_API_KEY,
    },
    crypto: {
      apiKey: env.CRYPTO_COMPARE_API_KEY,
    },
  },
} as const;

export { config };
