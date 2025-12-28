import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import Redis from "ioredis";

let redis: Redis | null = null;

export const getRedisClient = async (): Promise<Redis> => {
    if (redis) {
        return redis;
    }

    const redisUrl = env.REDIS_URL;

    redis = new Redis(redisUrl, { lazyConnect: true });

    redis.on('error', (error) => {
        logger.error({ err: error }, 'Redis connection error');
    })

    redis.on('connect', () => {
        logger.info('Redis connection established');
    })

    redis.on('reconnect', () => {
        logger.info('Redis reconnecting...');
    })

    redis.on('close', () => {
        logger.info('Redis connection closed');
    })

    return redis;
}


export const connectRedis = async () => {
    const client = await getRedisClient();
    if (client.status === "ready" || client.status == "connecting") {
        return;
    }
    await client.connect();
}


export const closeRedisClient = async () => {
    if (!redis) {
        return;
    }
    await redis.quit();
    redis = null;
}
