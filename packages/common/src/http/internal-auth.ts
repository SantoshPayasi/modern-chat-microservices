import { HttpError } from "../errors/http-error";
import type { RequestHandler } from "express";

export interface InternalAuthOptions {
    headerName?: string,
    exemptPaths?: string[]
}

export const DEFAULT_HEADER_NAME = "x-internal-auth";

export const createInternalAuthMiddleware = (
    expectedToken: string,
    options: InternalAuthOptions = {}
): RequestHandler => {
    const headerName = options.headerName?.toLowerCase() ?? DEFAULT_HEADER_NAME.toLowerCase();
    const exemptPaths = new Set(options.exemptPaths ?? []);
    return (req, _res, next) => {
        if (exemptPaths.has(req.path)) {
            return next();
        }

        const provided = req.headers[headerName];
        const token = Array.isArray(provided) ? provided[0] : provided;

        if (typeof token !== "string" || token !== expectedToken) {
            return next(new HttpError(401, "Unauthorized"));
        }
        return next();
    }
}