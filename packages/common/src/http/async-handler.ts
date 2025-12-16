import { Request, Response, NextFunction, RequestHandler } from "express";

export type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>;

const toError = (error: unknown) => {
    return error instanceof Error ? error : new Error(String(error));
}


const forwardError = (nextFn: ErrorForwarder, error: unknown) => {
    nextFn(toError(error));
}

type ErrorForwarder = (error: Error) => void;

export const asyncHandler = (handler: AsyncHandler): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        handler(req, res, next).catch((error: unknown) => forwardError(next, error));
    };
}