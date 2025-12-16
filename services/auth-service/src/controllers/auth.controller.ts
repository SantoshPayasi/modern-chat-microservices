import { register } from "@/services/auth.service";
import { RegisterInput } from "@/types/auth";
import { asyncHandler } from "@chat-app/common";
import { Request, RequestHandler, Response } from "express";

export const registerHandler: RequestHandler = asyncHandler(async (req: Request, res: Response) => {
    const payload = req.body as RegisterInput;

    const token = await register(payload);

    res.status(201).json({ token });
})