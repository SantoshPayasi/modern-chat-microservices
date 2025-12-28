import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { MongoClient } from "mongodb";

let client: MongoClient | null = null;

export const getMongoClient = async (): Promise<MongoClient> => {
    if (client) {
        return client;
    }

    const mongoUri = env.MONGO_URL;
    client = new MongoClient(mongoUri);
    await client.connect();
    logger.info("MongoDB connection established");
    return client;
}


export const closeMongoClient = async (): Promise<void> => {
    if (!client) {
        return;
    }
    await client.close();
    logger.info("MongoDB connection closed");
    client = null;
}