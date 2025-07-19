import Redis, { Cluster, RedisOptions } from "ioredis";
import { RedisConfig } from "./cache.config";

const sleep = async (timeout = 10) =>
  new Promise<void>((resolve) => setTimeout(resolve, timeout));

export const initCacheClient = (config: RedisConfig): Redis | Cluster => {
  const redisOptions: RedisOptions = {
    username: config.username,
    password: config.password,
    enableAutoPipelining: true,
  };

  return new Redis(
    Object.assign(
      {
        host: config.domain,
        port: config.port,
      },
      redisOptions,
    ),
  );
};

export class CacheService {
  private readonly client: Redis | Cluster;
  private readonly logger?: Context["logger"];
  private readonly LOCK_NAME_PREFIX = "lock:";
  private readonly KEY_DEFAULT_LIVE_IN_SECONDS = 172800;

  constructor(
    private readonly config: RedisConfig,
    logger?: Context["logger"],
  ) {
    this.logger = logger;
    this.client = initCacheClient(this.config);
  }

  public get redis(): Redis | Cluster {
    return this.client;
  }

  public setMaxListeners(listeners: number) {
    this.client.setMaxListeners(listeners);
  }

  public async initialize(): Promise<CacheService> {
    return new Promise<CacheService>((resolve, reject) => {
      this.client.on("connect", () => {
        this.logger?.debug("🤖 Redis Session: Connecting to Redis ...");
      });

      this.client.on("error", (error: Error) => {
        this.logger?.error(
          "💥 Session: Could not establish a connection to Redis",
          {
            data: {
              error: {
                message: error.message,
              },
            },
          },
        );

        reject(error);
      });

      this.client.on("ready", () => {
        this.logger?.debug("🤖 Session: Connection to Redis is ready");
        resolve(this);
      });
    });
  }

  public async set<T>(
    key: string,
    value: T,
    timeoutInSecond?: number,
  ): Promise<void> {
    await this.client.set(key, JSON.stringify(value));
    await this.client.expire(
      key,
      timeoutInSecond || this.KEY_DEFAULT_LIVE_IN_SECONDS,
    );
  }

  public async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);

    if (!value) {
      return null;
    }

    return JSON.parse(value);
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async acquireLock(key: string, timeout = 10000): Promise<string> {
    const lockName = `${this.LOCK_NAME_PREFIX}${key}`;
    const token = `${Date.now() + timeout + 1}`;

    const acquire = async (): Promise<string> => {
      const setResult = await this.client.setnx(
        lockName,
        JSON.stringify(token),
      );

      if (setResult === 1) {
        await this.client.expire(lockName, Math.ceil(timeout / 1000));
        return token;
      } else {
        await sleep();
        return acquire();
      }
    };

    return acquire();
  }

  public async releaseLock(
    key: string,
    token: string,
  ): Promise<string | false> {
    const lockName = `${this.LOCK_NAME_PREFIX}${key}`;
    const value = await this.get<string>(lockName);

    if (value === token) {
      await this.delete(lockName);
      return value;
    }

    return false;
  }

  public async publish<T>(key: string, payload: T) {
    await this.client.publish(key, JSON.stringify(payload));
  }
  public async subscribe<T>(
    key: string,
    callback: (payload: T) => Promise<void> | void,
  ) {
    await this.client.subscribe(key);
    this.client.on("message", async (_channel, payload) =>
      callback(<T>payload),
    );
  }
}
