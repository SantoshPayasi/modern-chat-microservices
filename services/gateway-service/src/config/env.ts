import "dotenv/config";
import { createEnv, z } from "@chat-app/common";


const envSchema = z.object({
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    GATEWAY_PORT: z.coerce.number().int().min(0).max(65535).default(4000),
    AUTH_SERVICE_URL: z.string().url().default("http://localhost:4003"),
    INTERNAL_AUTH_TOKEN: z.string().default("secret"),
})

type envType = z.infer<typeof envSchema>;

export const env: envType = createEnv(envSchema, { serviceName: "gateway-service" });

export type Env = envType;
