import { loginUser, refreshTokenUser, registerUser, revokeRefreshTokenUser } from "@/controller/auth.controller";
import { loginSchema, refreshSchema, registerSchema, revokeSchema } from "@/validation/auth.schema";
import { validateRequest } from "@chat-app/common/src/http/validate-request";
import { Router } from "express";

export const authRouter: Router = Router();

authRouter.post("/register", validateRequest({ body: registerSchema }), registerUser);
authRouter.post("/login", validateRequest({ body: loginSchema }), loginUser);
authRouter.post("/refresh-token", validateRequest({ body: refreshSchema }), refreshTokenUser);
authRouter.post("/revoke-token", validateRequest({ body: revokeSchema }), revokeRefreshTokenUser);

