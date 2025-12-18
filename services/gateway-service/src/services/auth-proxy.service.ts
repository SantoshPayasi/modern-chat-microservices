import { env } from "@/config/env";
import { HttpError } from "@chat-app/common";
import axios from "axios";

const client = axios.create({
    baseURL: env.AUTH_SERVICE_URL,
    timeout: 5000,
})

const authHeader = {
    headers: {
        "x-internal-auth": env.INTERNAL_AUTH_TOKEN,
    }
} as const;

export interface AuthTokens {
    accessToken: string,
    refreshToken: string,
}

export interface UserData {
    id: string,
    email: string,
    displayName: string,
    createdAt: Date
}

export interface AuthResponse extends AuthTokens {
    user: UserData
}



export interface RegisterPayload {
    email: string,
    password: string,
    displayName: string,
}

export interface LoginPayload {
    email: string,
    password: string,
}

export interface RefreshPayload {
    refreshToken: string,
}

export interface RevokePayload {
    userId: string,
}


const resolvedMessages = (status: number, data: unknown): string => {
    if (typeof data == "object" && data && "message" in data) {
        const message = (data as Record<string, unknown>).message;
        if (typeof message == "string" && message.trim().length > 0) {
            return message;
        }
    }
    return status >= 500 ? "Authentication service is unavailable" : "Something went wrong";
}

export const handleAxiosError = (error: unknown): never => {
    if (!axios.isAxiosError(error) || !error.response) {
        throw new HttpError(500, "Authentication service is unavailable");
    }
    const { status, data } = error.response as { status: number, data: unknown };
    throw new HttpError(status, resolvedMessages(status, data));
}


export const authProxyService = {
    register: async (payload: RegisterPayload): Promise<AuthResponse> => {
        try {
            const response = await client.post<AuthResponse>("/auth/register", payload, authHeader);
            return response.data;
        } catch (error) {
            return handleAxiosError(error);
        }
    },

}