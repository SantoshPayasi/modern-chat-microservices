 import { logger } from "@/utils/logger";
 import {HttpError} from "@chat-app/common";
 import {ErrorRequestHandler} from "express";
 

  export const errorHandler:ErrorRequestHandler =(err, _ , response, _next)=>{
    logger.error({err}, "Unexprected error occured .")
    const error = err instanceof HttpError ? err : undefined;
    const statusCode = error?.statusCode ?? 500;
    const message = statusCode >= 500 ? "Internal server error": (error?.message??"unknown error");

    const payload = error?.details ? {message, details:error?.details} : {message};

    response.status(statusCode).json(payload);

    void _next();

  }