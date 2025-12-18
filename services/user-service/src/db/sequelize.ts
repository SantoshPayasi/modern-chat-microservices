import { Sequelize } from "sequelize";

import { env } from "@/config/env";
import { logger } from "@/utils/logger";


export const sequelize = new Sequelize(env.USER_DB_URL, {
    dialect: "postgres",
    logging:
        env.NODE_ENV === "development"
            ? (msg: unknown) => logger.debug({ message: msg })
            : false,
    define: {
        underscored: true,
        freezeTableName: true
    }
})

export const connectToDatabase = async () => {
    await sequelize.authenticate();
    logger.info("User database connection has been established successfully.");
}

export const initializeDatabase = async () => {
    await connectToDatabase();
    const syncOptions = env.NODE_ENV === "development" ? { alter: true } : {};
    await sequelize.sync(syncOptions);
    logger.info("User database has been initialized successfully.");
}

export const closeDatabaseConnection = async () => {
    await sequelize.close();
    logger.info("User database connection has been closed successfully.");
}