import { OTPStore } from '@otp-forge/otp-forge';
import type {
  RedisClientType,
  RedisFunctions,
  RedisModules,
  RedisScripts,
} from '@redis/client';

type RedisClient = RedisClientType<RedisFunctions, RedisModules, RedisScripts>;

class RedisStore extends OTPStore {
  private client: RedisClient;

  constructor(client: RedisClient) {
    super();
    this.client = client;
  }

  async get(key: string): Promise<[number, Date] | undefined> {
    const value = await this.client.get(key);

    if (!value) {
      return undefined;
    }

    const data = JSON.parse(value);
    return data;
  }

  async set(key: string, otp: number, ttl: number) {
    // await this.client.lset(key, [otp, new Date(Date.now())], { EX: ttl });
    // set an array value: [otp, new Date(Date.now() + ttl * 1000)] in redis
    await this.client.set(
      key,
      JSON.stringify([otp, new Date(Date.now() + ttl * 1000)]),
      { EX: ttl }
    );
  }

  async del(key: string) {
    await this.client.del(key);
  }
}

export default RedisStore;
