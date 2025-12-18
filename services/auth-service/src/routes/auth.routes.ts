import { loginHandler, refreshTokenHandler, registerHandler, revokeRefreshTokenHandler } from "@/controllers/auth.controller";
import { loginSchema, refreshSchema, registerSchema, revokeSchema } from "@/schemas/auth.schema";
import { validateRequest } from "@chat-app/common/src/http/validate-request";
import { Router } from "express";


export const authRouter: Router = Router();


authRouter.post("/register", validateRequest({ body: registerSchema.shape.body }), registerHandler);
authRouter.post("/login", validateRequest({ body: loginSchema.shape.body }), loginHandler);
authRouter.post("/refresh-token", validateRequest({ body: refreshSchema.shape.body }), refreshTokenHandler);
authRouter.post("/revoke-token", validateRequest({ body: revokeSchema.shape.body }), revokeRefreshTokenHandler);
