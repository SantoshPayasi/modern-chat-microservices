import { registerUser } from "@/controller/auth.controller";
import { registerSchema } from "@/validation/auth.schema";
import { validateRequest } from "@chat-app/common/src/http/validate-request";
import { Router } from "express";

export const authRouter: Router = Router();

authRouter.post("/register", validateRequest({ body: registerSchema }), registerUser);
