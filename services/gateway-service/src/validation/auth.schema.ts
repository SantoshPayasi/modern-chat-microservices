import { z } from "@chat-app/common";


export const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    displayName: z.string().min(3),
})

export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export const refreshSchema = z.object({
    refreshToken: z.string(),
})

export const revokeSchema = z.object({
    userId: z.string(),
})