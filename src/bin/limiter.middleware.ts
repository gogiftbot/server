import { config } from "@/config";
import { createClient } from "redis";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";

const limiterMiddleware = (logger?: Context["logger"]) => {
  const client = createClient({ url: config.redis.url });
  client.connect().catch((error) =>
    logger?.error("💥 Session: Could not establish a connection to Redis", {
      data: {
        error: {
          message: error.message,
        },
      },
    }),
  );

  return rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args: string[]) => client.sendCommand(args),
    }),
  });
};

export { limiterMiddleware };
