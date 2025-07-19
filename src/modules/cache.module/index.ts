import { config } from "@/config";
import { CacheService } from "./cache.service";

const initCache = (logger?: Context["logger"]) => {
  const cache = new CacheService(config.redis, logger);
  cache.initialize();
  return cache;
};

type CacheI = ReturnType<typeof initCache>;

export { initCache, CacheI };
