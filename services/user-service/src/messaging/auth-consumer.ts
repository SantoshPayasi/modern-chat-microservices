import { env } from "@/config/env";
import { userService } from "@/services/user.service";
import { logger } from "@/utils/logger";
import {
    AUTH_EVENT_EXCHANGE,
    AUTH_USER_REGISTERED_ROUTING_KEY,
    AuthRegisteredEvents,
    type AuthUserRegisteredPayload
} from "@chat-app/common";

import {
    connect,
    type Channel,
    type Connection,
    type ChannelModel,
    type ConsumeMessage,
    Replies
} from "amqplib";

type ManageConnection = Connection & ChannelModel;

let connectionRef: ManageConnection | null = null;
let channel: Channel | null = null;

let consumerTag: string | null = null;

const QUEUE_NAME = "auth-service.auth.events";

const closeConnection = async (conn: ManageConnection) => {
    await conn.close();
    connectionRef = null;
    channel = null;
    consumerTag = null;
}


export const handleMessage = async (message: ConsumeMessage, ch: Channel) => {
    const rawEvent = message.content.toString('utf-8');
    const event = JSON.parse(rawEvent) as AuthRegisteredEvents;

    await userService.syncFromAuthUser(event.payload);
    ch.ack(message);
}


export const startAuthConsumer = async () => {
    if (!env.RABBITMQ_URL) {
        logger.warn("RABBITMQ_URL is not set. Skipping auth consumer.");
        return;
    }
    if (channel) {
        return;
    }

    const connection = (await connect(env.RABBITMQ_URL)) as ManageConnection;
    connectionRef = connection;
    const ch = await connection.createChannel();
    channel = ch;
    await ch.assertExchange(AUTH_EVENT_EXCHANGE, 'topic', { durable: true });
    const queue = await ch.assertQueue(QUEUE_NAME, { durable: true });
    await ch.bindQueue(queue.queue, AUTH_EVENT_EXCHANGE, AUTH_USER_REGISTERED_ROUTING_KEY);

    const consumerHandler = (msg: ConsumeMessage | null) => {
        if (!msg) return;

        void handleMessage(msg, ch).catch((error: unknown) => {
            logger.error({ error }, "Error handling auth event");
            ch.nack(msg, false, false);
        });
    }

    const result: Replies.Consume = await ch.consume(queue.queue, consumerHandler);
    consumerTag = result.consumerTag;

    connection.on('close', () => {
        logger.info("Auth consumer connection closed");
        connectionRef = null;
        channel = null;
        consumerTag = null;
    })

    connection.on('error', (error: unknown) => {
        logger.error({ error }, "Auth consumer connection error");
    })

    logger.info("Auth consumer started");

}

export const stopAuthEventConsumer = async () => {
    try {
        const ch = channel;
        if (ch && consumerTag) {
            await ch.cancel(consumerTag);
            consumerTag = null;
        }
        if (ch) {
            await ch.close();
            channel = null;
        }

        const conn = connectionRef;
        if (conn) {
            await closeConnection(conn);
            connectionRef = null;
        }
    } catch (error) {
        logger.error({ error }, "Error stopping auth consumer");
    }
}