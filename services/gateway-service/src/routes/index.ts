import type { Router } from "express";
import { authRouter } from "@/routes/auth.route";
import { userRoutes } from "./user.route";


export const registerRoutes = (app: Router) => {
    app.use("/auth", authRouter);
    authRouter.use("/users", userRoutes);
}