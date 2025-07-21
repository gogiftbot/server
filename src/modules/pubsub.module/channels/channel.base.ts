export class PubsubChannel<T> {
  constructor(
    private readonly cache: Context["cache"],
    public readonly key: string,
  ) {}

  public async publish(payload: T) {
    await this.cache.publish(this.key, payload);
  }
  public async subscribe(callback: (payload: T) => any) {
    await this.cache.subscribe(this.key, callback);
  }
}
