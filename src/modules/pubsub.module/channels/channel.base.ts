export class PubsubChannel<T> {
  constructor(
    private readonly publisher: Context["cache"],
    private readonly subscriber: Context["cache"],
    public readonly key: string,
  ) {}

  public async publish(payload: T) {
    await this.publisher.publish(this.key, payload);
  }
  public async subscribe(callback: (payload: T) => any) {
    await this.subscriber.subscribe(this.key, callback);
  }
}
