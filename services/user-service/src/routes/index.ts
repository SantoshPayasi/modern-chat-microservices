import type { Router } from "express";
import { userRoutes } from "./user.route";

export const registerRoutes = (app:Router)=>{
    app.use('/users', userRoutes);
}