import { PubsubChannel } from "./channel.base";

type LivePubsubPayload = { id: string; nft: { sku: string }; price: number };
class LivePubsubChannel extends PubsubChannel<LivePubsubPayload> {
  constructor(publisher: Context["cache"], subscriber: Context["cache"]) {
    super(publisher, subscriber, "live");
  }
}

export const initChannels = (
  publisher: Context["cache"],
  subscriber: Context["cache"],
) => {
  return {
    live: new LivePubsubChannel(publisher, subscriber),
  } as const;
};
