import { z } from "zod";
import { HttpError } from "../errors/http-error";
import type { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

type Schema = ZodSchema;

type ParamsRecord = Record<string, string>;
type QueryRecord = Record<string, unknown>;

export interface RequestValidationSchemas {
    body?: Schema;
    params?: Schema;
    query?: Schema;
}

function formattedError(error: ZodError) {
    return error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
    }))
}

export const validateRequest = (schema: RequestValidationSchemas) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        try {
            if (schema.body) {
                const parsedBody = schema.body.parse(req.body) as unknown;
                req.body = parsedBody;
            }
            if (schema.params) {
                const parsedParams = schema.params.parse(req.params) as ParamsRecord;
                req.params = parsedParams as Request['params'];
            }
            if (schema.query) {
                const parsedQuery = schema.query.parse(req.query) as QueryRecord;
                req.query = parsedQuery as Request['query'];
            }
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                next(new HttpError(422, "validation error", { issues: formattedError(error) }));
                return;
            }
            next(error);
        }
    };
}