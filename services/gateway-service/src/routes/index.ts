import type { Router } from "express";
import { authRouter } from "@/routes/auth.route";


export const registerRoutes = (app: Router) => {
    app.use("/auth", authRouter);
}