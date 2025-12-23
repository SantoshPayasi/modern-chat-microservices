import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "./middlewares/error-handler";
import { createInternalAuthMiddleware } from "@chat-app/common";
import { env } from "./config/env";
import { registerRoutes } from "./routes";

export const createApp = (): Application => {
    const app = express();

    app.use(helmet())
    app.use(cors({ origin: "*", credentials: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(createInternalAuthMiddleware(env.INTERNAL_AUTH_TOKEN, {
        exemptPaths: ['/users/health']
    }));


    registerRoutes(app);
    
    app.use((_request, response) => {
        response.status(404).json({ message: "Not Found" });
    })


    app.use(errorHandler);
    return app;
}
