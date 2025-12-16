import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { AuthRegisteredEvents, AUTH_EVENT_EXCHANGE, type AuthUserRegisteredPayload, AUTH_USER_REGISTERED_ROUTING_KEY } from "@chat-app/common";
import { type ChannelModel, connect, type Channel } from "amqplib";

let connectionRef: ChannelModel | null = null;

let channel: Channel | null = null;

export const initEventPublishing = async () => {
    if (!env.RABBITMQ_URL) {
        logger.warn("RABBITMQ_URL is not set");
        return;
    }

    if (channel) {
        return;
    }

    const connection = await connect(env.RABBITMQ_URL);
    connectionRef = connection;
    channel = await connection.createChannel();

    await channel.assertExchange(AUTH_EVENT_EXCHANGE, "topic", { durable: true });

    connection.on("close", () => {
        logger.warn("RabbitMQ connection closed");
        channel = null;
        connectionRef = null;
    })

    connection.on("error", (error) => {
        logger.warn({ message: "RabbitMQ connection error", error });
        channel = null;
        connectionRef = null;
    })

    logger.info("Auth Service publisher connection established");


};


export const publishAuthUserRegisteredEvent = async (payload: AuthUserRegisteredPayload) => {
    if (!channel) {
        logger.warn("RabbitMQ channel is not initialized");
        return;
    }

    const event = {
        type: AUTH_USER_REGISTERED_ROUTING_KEY,
        payload,
        occurredOn: new Date().toISOString(),
        metadata: { version: 1 }
    }

    const published = channel.publish(
        AUTH_EVENT_EXCHANGE,
        AUTH_USER_REGISTERED_ROUTING_KEY,
        Buffer.from(JSON.stringify(event)),
        { contentType: "application/json", persistent: true }
    );

    if (!published) {
        logger.warn("Failed to publish Auth User Registered Event");
        return;
    }

    logger.info({ message: "Auth User Registered Event published", event });
}

export const closePublisher = async () => {
    try {
        const cn = channel;
        if (cn) {
            await cn.close();
            channel = null;
        }
        const conn = connectionRef;
        if (conn) {
            await conn.close();
            connectionRef = null;
        }
        logger.info("Auth Service publisher connection closed");
    } catch (error) {
        logger.error({ err: error }, "Failed to close Auth Service publisher connection");
    }
}