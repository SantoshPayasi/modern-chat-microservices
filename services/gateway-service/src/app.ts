import express, { type Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { errorHandler } from "@/middlewares/error-handler";
import { registerRoutes } from "@/routes";
import { createInternalAuthMiddleware } from "@chat-app/common";
import { env } from "./config/env";

export const createApp = (): Application => {
    const app = express();

    app.use(helmet())
    app.use(cors({ origin: "*", credentials: true }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(createInternalAuthMiddleware(env.INTERNAL_AUTH_TOKEN, {
        exemptPaths: ["/auth/register", "/auth/login"]
    }));
    registerRoutes(app);
    app.use((_request, response) => {
        response.status(404).json({ message: "Not Found" });
    })


    app.use(errorHandler);
    return app;
}
