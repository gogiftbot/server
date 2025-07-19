import { PubsubChannel } from "./channel.base";

type LivePubsubPayload = { id: string; nft: { sku: string }; price: number };
class LivePubsubChannel extends PubsubChannel<LivePubsubPayload> {
  constructor(cache: Context["cache"]) {
    super(cache, "live");
  }
}

export const initChannels = (cache: Context["cache"]) => {
  return {
    live: new LivePubsubChannel(cache),
  } as const;
};
