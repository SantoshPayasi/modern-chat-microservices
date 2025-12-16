import { createApp } from "@/app";
import { createServer } from "http";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import { closeDatabaseConnection, connectToDatabase } from "./db/sequelize";
import { initModels } from "./models";
import { closePublisher, initEventPublishing } from "./messaging/event-publishing";

const main = async () => {
    try {

        await connectToDatabase();
        await initModels();
        await initEventPublishing();
        const app = createApp();
        const server = createServer(app);

        const port = env.AUTH_SERVICE_PORT;

        server.listen(port, () => {
            logger.info(`Auth service running on port ${port}`);
        });


        const shutdown = async () => {
            logger.info("Shutting down auth service...");
            Promise.all([
                closeDatabaseConnection(),
                closePublisher()
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