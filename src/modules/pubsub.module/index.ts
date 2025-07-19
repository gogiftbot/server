import { initChannels } from "./channels";

const initPubsub = (cache: Context["cache"]) => {
  const pubsub = initChannels(cache);
  return pubsub;
};

type PubsubI = ReturnType<typeof initPubsub>;

export { initPubsub, PubsubI };
