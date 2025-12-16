import type { ZodObject, ZodRawShape } from "zod";

interface EnvOptions {
    source?: NodeJS.ProcessEnv;
    serviceName?: string;

}

type SchemaOutput<TSchema extends ZodRawShape> = ZodObject<TSchema>["_output"];

export const createEnv = <TSchema extends ZodRawShape>(schema: ZodObject<TSchema>, options: EnvOptions = {}): SchemaOutput<TSchema> => {
    const { source = process.env, serviceName = "service" } = options;

    const parsed = schema.safeParse(source);

    if (!parsed.success) {
        const formattedError = parsed.error.format();
        throw new Error(`Invalid environment variables for ${serviceName}: ${JSON.stringify(formattedError)}`);
    }

    return parsed.data;
}

export type EnvSchema<TSchema extends ZodRawShape> = ZodObject<TSchema>;