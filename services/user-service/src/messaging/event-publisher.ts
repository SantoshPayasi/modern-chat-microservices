import { env } from "@/config/env";
import { logger } from "@/utils/logger";
import { USER_EVENT_EXCHANGE, type UserCreatedEvent, UserCreatedPayload, USER_CREATED_ROUTING_KEY } from "@chat-app/common";
import amqplib from "amqplib";
import type { Channel, ChannelModel, Connection } from "amqplib";


type ManagedConnection= Connection & Pick<ChannelModel, 'close'|'createChannel'>;

let connection:ManagedConnection|null = null;
let channel: Channel|null = null;

const messagingEnabled = Boolean(env.RABBITMQ_URL);

const ensureChennnal = async():Promise<Channel|null> =>{
    if(!messagingEnabled){
        return null;
    }
    if(channel){
        return channel;
    }

    if(!env.RABBITMQ_URL){
        return null;
    }

    const amqpConnection = (await amqplib.connect(env.RABBITMQ_URL)) as unknown as ManagedConnection;

    connection = amqpConnection;
    amqpConnection.on('close', ()=>{
       logger.warn("RabbitMQ connection is closed");
       connection = null;
       channel = null;
    })

    amqpConnection.on('error', (error)=>{
           logger.error({err: error}, 'RabbitMQ connection error')
    });

    const amqpChennal = await amqpConnection.createChannel();
    channel = amqpChennal;

    await amqpChennal.assertExchange(USER_EVENT_EXCHANGE, 'topic', {durable:true});

    return amqpChennal;
}

export const initMessaging = async() =>{
    if(!messagingEnabled){
        logger.info("RabbitMQ url is not configuraed");
        return;
    }
    await ensureChennnal();
    logger.info("User Service rabbitMQ publisher is initilized");

}

export const closeMessaging =async() =>{
try {
    if(channel){
        const currentConnection: Channel = channel;
        channel = null;
        await currentConnection.close();
    }
    if(connection){
        const currentConnection:ManagedConnection = connection;
        connection = null;
        await currentConnection.close();
    }

    logger.info("User service RabbitMQ Event publisher is closed");
} catch (error) {
      logger.error({err: error}, "Error closing RabbitMQ connection/channel");
}
}

export const publishUserCreatedEvent = async(payload:UserCreatedPayload)=>{
    const channel = await ensureChennnal();

    if(!channel){
        logger.debug({payload}, "Skipping user.created event publish; messaging disabled");
        return;
    }
    
    const event:UserCreatedEvent = {
        type:USER_CREATED_ROUTING_KEY,
        payload,
        occurredOn: new Date().toISOString(),
        metaData: {version:1}
    }

    try {
       const success = channel.publish(
        USER_EVENT_EXCHANGE,
        USER_CREATED_ROUTING_KEY,
        Buffer.from(JSON.stringify(event)),
        {contentType:'application/json', persistent:true}
       )

       if(!success){
        logger.warn({event}, "failed to publish user created event");
       }
    } catch (error) {
        logger.error({err: error}, "Erro publishing user.created event");
    }
}
