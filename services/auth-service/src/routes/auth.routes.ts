import { registerHandler } from "@/controllers/auth.controller";
import { registerSchema } from "@/schemas/auth.schema";
import { validateRequest } from "@chat-app/common/src/http/validate-request";
import { Router } from "express";


export const authRouter: Router = Router();


authRouter.post("/register", validateRequest({ body: registerSchema.shape.body }), registerHandler);