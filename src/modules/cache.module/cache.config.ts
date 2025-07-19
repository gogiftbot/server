import { z } from "zod";

export const redisConfigSchema = z.object({
  domain: z.string().min(1),
  port: z.number(),
  username: z.string().optional(),
  password: z.string().optional(),
});

export type RedisConfig = z.infer<typeof redisConfigSchema>;
