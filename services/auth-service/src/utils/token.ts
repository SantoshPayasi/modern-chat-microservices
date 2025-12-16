import bcrypt from "bcrypt";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "@/config/env";

const ACCESS_TOKEN: Secret = env.JWT_SECRET;
const REFRESH_TOKEN: Secret = env.JWT_REFRESH_SECRET;

const ACCESS_OPTIONS: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as SignOptions["expiresIn"]
}

const REFRESH_OPTIONS: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"]
}

export const hashPassword = (password: string): Promise<string> => {
    const saltRounds = 12;
    return bcrypt.hash(password, saltRounds);
}


export const verifyPassword = (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
}

interface AccessTokenPayload {
    sub: string;
    email: string;

}

interface RefreshTokenPayload {
    sub: string;
    tokenId: string;
}


export const signAccessToken = (payload: AccessTokenPayload): string => {
    return jwt.sign(payload, ACCESS_TOKEN, ACCESS_OPTIONS);
}

export const signRefreshToken = (payload: RefreshTokenPayload): string => {
    return jwt.sign(payload, REFRESH_TOKEN, REFRESH_OPTIONS);
}


export const verifyRefreshToken = (token: string): RefreshTokenPayload => {
    return jwt.verify(token, REFRESH_TOKEN) as RefreshTokenPayload;
}

export const verifyAccessToken = (token: string): AccessTokenPayload => {
    return jwt.verify(token, ACCESS_TOKEN) as AccessTokenPayload;
}