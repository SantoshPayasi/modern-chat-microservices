import { login, refreshToken, register, revokeRefreshToken } from "@/services/auth.service";
import { LoginInput, RegisterInput } from "@/types/auth";
import { asyncHandler, HttpError } from "@chat-app/common";
import { Request, RequestHandler, Response } from "express";

export const registerHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as RegisterInput;
    const token = await register(payload);
    res.status(201).json({ token });
})

export const loginHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as LoginInput;
    const token = await login(payload);
    res.status(200).json({ token });
})

export const refreshTokenHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as { refreshToken?: string };
    if (!payload.refreshToken) {
        throw new HttpError(400, "Refresh token is required");
    }
    const tokens = await refreshToken(payload.refreshToken);
    res.status(200).json({ tokens });
})


export const revokeRefreshTokenHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as { userId?: string };
    if (!payload.userId) {
        throw new HttpError(400, "User id is required");
    }
    await revokeRefreshToken(payload.userId);
    res.status(204).send();
})