import { createApp } from "@/app";
import { createServer } from "http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { initializeDatabase } from "./db/sequelize";
import { startAuthConsumer } from "./messaging/auth-consumer";


const main = async () => {
    try {
        await initializeDatabase();
        await startAuthConsumer();
        const app = createApp();
        const server = createServer(app);

        const port = env.USER_SERVICE_PORT;

        server.listen(port, () => {
            logger.info(`User service running on port ${port}`);
        });


        const shutdown = async () => {
            logger.info("Shutting down user service...");
            Promise.all([
            ]).catch((error: unknown) => {
                logger.error({ error }, "Error shutting down auth service");
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