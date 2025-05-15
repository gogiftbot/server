import { SendMode, toNano } from "@ton/core";
import { mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV5R1, internal } from "@ton/ton";
import { config } from "config";

export class TonService {
  public async send(payload: { amount: number; address: string }) {
    try {
      const client = new TonClient({
        endpoint: "https://toncenter.com/api/v2/jsonRPC",
        apiKey: config.ton.center.apiKey,
      });

      const mnemonic = config.ton.mnemonic.split(" ");
      const keyPair = await mnemonicToPrivateKey(mnemonic);
      const walletContract = WalletContractV5R1.create({
        publicKey: keyPair.publicKey,
      });

      const wallet = client.open(walletContract);

      const balance = await client.getBalance(wallet.address);
      const amountToSend = toNano(payload.amount);
      const estimatedFee = toNano("0.01");
      if (balance < amountToSend + estimatedFee) {
        throw new Error("INFLUENT_BALANCE");
      }

      const seqno = await wallet.getSeqno();

      await wallet.sendTransfer({
        seqno,
        secretKey: keyPair.secretKey,
        messages: [
          internal({
            to: payload.address,
            value: toNano(payload.amount),
          }),
        ],
        sendMode: SendMode.IGNORE_ERRORS,
      });

      return wallet.address.toString({
        urlSafe: true,
        bounceable: false,
      });
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
