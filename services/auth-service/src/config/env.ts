import "dotenv/config";
import { createEnv, z } from "@chat-app/common";


const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    AUTH_SERVICE_PORT: z.coerce.number().int().min(0).max(65535).default(4003),
    AUTH_DB_URL: z.string().url(),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default("1d"),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_REFRESH_EXPIRES_IN: z.string().default("30d"),
    INTERNAL_AUTH_TOKEN: z.string(),
    RABBITMQ_URL: z.string().url(),
})

type envType = z.infer<typeof envSchema>;

export const env: envType = createEnv(envSchema, { serviceName: "auth-service" });

export type Env = envType;
