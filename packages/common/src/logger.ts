import type { Logger, LoggerOptions } from "pino";

import pino from "pino";

type CreateLoggerOptions = LoggerOptions & {
    name: string;
}

export const createLogger = (options: CreateLoggerOptions): Logger => {
    const { name, ...restOptions } = options;
    const transportConfig = process.env.NODE_ENV === "development" ? {
        target: "pino-pretty",
        options: {
            colorize: true,
            ignore: "pid,hostname",
            translateTime: "SYS:dd-mm-yyyy HH:MM:ss",
        }
    } : undefined;

    return pino({
        name,
        level: process.env.LOG_LEVEL || "info",
        ...restOptions,
        transport: transportConfig,
    })
}
