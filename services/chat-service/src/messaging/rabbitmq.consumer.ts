import {
    USER_EVENT_EXCHANGE,
    USER_CREATED_ROUTING_KEY,
    UserCreatedEvent,
    type UserCreatedPayload
} from "@chat-app/common";

import {
    connect,
    type Channel,
    type Connection,
    type ChannelModel,
    type ConsumeMessage,
    Replies
} from "amqplib";

import { userRepository } from "../repositories/user.repository";
import { env } from "@/config/env";
import { logger } from "@/utils/logger";



let connectionRef: ChannelModel | null = null;
let channel: Channel | null = null;

let consumerTag: string | null = null;

const EVENT_QUEUE = "chat-service.user.events";

const closeConnection = async (conn: ChannelModel) => {
    if (conn) {
        await conn.close();
    }

};

const handleUserCreated = async (event: UserCreatedEvent) => {
    await userRepository.upsertUser(event.payload);
}

export const startConsumers = async () => {
    if (!env.RABBITMQ_URL) {
        logger.error("RABBITMQ_URL is not defined");
        return;
    }

    const conn = await connect(env.RABBITMQ_URL);
    connectionRef = conn;

    const ch = await conn.createChannel();
    channel = ch;

    await ch.assertExchange(USER_EVENT_EXCHANGE, 'topic', { durable: true });

    const queue = await ch.assertQueue(EVENT_QUEUE, { durable: true });

    await ch.bindQueue(queue.queue, USER_EVENT_EXCHANGE, USER_CREATED_ROUTING_KEY);


    const consumerHandler = (message: ConsumeMessage | null) => {
        if (!message) {
            return;
        }

        void (async () => {
            const payload = message.content.toString('utf-8');
            const event = JSON.parse(payload) as UserCreatedEvent

            await handleUserCreated(event);
            ch.ack(message);
        })().catch((error: unknown) => {
            logger.error({ err: error }, "Error handling user created event");
            ch.nack(message, false, false);
        });
    };

    const result: Replies.Consume = await ch.consume(queue.queue, consumerHandler);
    consumerTag = result.consumerTag;

    logger.info("Chat consumer started");
}

export const stopConsumers = async () => {
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
        logger.error({ error }, "Error stopping chat consumer");
    }
}