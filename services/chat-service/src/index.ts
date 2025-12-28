import { createApp } from "@/app";
import { createServer } from "http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { closeMongoClient, getMongoClient } from "./client/mongo.client";
import { closeRedisClient, connectRedis } from "./client/redis.client";
import { startConsumers, stopConsumers } from "./messaging/rabbitmq.consumer";


const main = async () => {
    try {
        await Promise.all([
            getMongoClient(),
            connectRedis(),
            startConsumers()
        ])
        const app = createApp();
        const server = createServer(app);

        const port = env.CHAT_SERVICE_PORT;

        server.listen(port, () => {
            logger.info(`Chat service running on port ${port}`);
        });


        const shutdown = async () => {
            logger.info("Shutting down chat service...");
            Promise.all([
                closeMongoClient(),
                closeRedisClient(),
                stopConsumers()
            ]).catch((error: unknown) => {
                logger.error({ error }, "Error shutting down chat service");
            }).finally(() => {
                server.close(() => process.exit(0));
            });
        };

        process.on("SIGINT", shutdown);
        process.on("SIGTERM", shutdown);
        process.on("uncaughtException", (error: unknown) => {
            logger.error({ error }, "Uncaught exception");
            shutdown();
        });
        process.on("unhandledRejection", (reason: unknown) => {
            logger.error({ reason }, "Unhandled rejection");
            shutdown();
        });
    } catch (error) {
        logger.error(error);
        process.exit(1);
    }
}
void main();