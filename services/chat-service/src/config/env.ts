import "dotenv/config";
import { createEnv, z } from "@chat-app/common";


const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    CHAT_SERVICE_PORT: z.coerce.number().int().min(0).max(65535).default(4002),
    MONGO_URL: z.string().url().default("mongodb://localhost:27017"),
    REDIS_URL: z.string().url().default("redis://localhost:6379"),
    INTERNAL_API_TOKEN: z.string().default("secret"),
    RABBITMQ_URL: z.string().url().default("amqp://localhost:5672"),
    JWT_SECRET: z.string().min(1)
})

type envType = z.infer<typeof envSchema>;

export const env: envType = createEnv(envSchema, { serviceName: "chat-service" });

export type Env = envType;
