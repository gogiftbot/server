import { config } from "@/config";
import { CacheService } from "../cache.module/cache.service";
import { initChannels } from "./channels";

const initPubsub = () => {
  const publisher = new CacheService(config.redis);
  const subscriber = new CacheService(config.redis);
  const pubsub = initChannels(publisher, subscriber);
  return pubsub;
};

type PubsubI = ReturnType<typeof initPubsub>;

export { initPubsub, PubsubI };
