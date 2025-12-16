import { sequelize } from "@/db/sequelize";
import { publishAuthUserRegisteredEvent } from "@/messaging/event-publishing";
import { RefreshToken, UserCredentials } from "@/models";
import { AuthResponse, RegisterInput } from "@/types/auth";
import { hashPassword, signAccessToken, signRefreshToken } from "@/utils/token";
import { HttpError } from "@chat-app/common";
import { Op, Transaction, where } from "sequelize";


const REFRESH_TOKEN_TTL_DAYS = 30;

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
    const existing = await UserCredentials.findOne({ where: { email: { [Op.eq]: input.email } } })
    if (existing) {
        throw new HttpError(400, "User with this email already exists");
    }
    const transaction = await sequelize.transaction();
    try {
        const passwordHash = await hashPassword(input.password);
        const user = await UserCredentials.create({
            email: input.email,
            passwordHash,
            displayName: input.displayName
        }, { transaction });

        const refreshTokenRecord = await createRefreshToken(user.id, transaction);

        await transaction.commit();

        const accessToken = signAccessToken({ sub: user.id, email: user.email });

        const refreshToken = signRefreshToken({ sub: user.id, tokenId: refreshTokenRecord.id });

        // Publish event userRegistered

        const userdata = {
            id: user.id,
            email: user.email,
            displayName: user.displayName,
            createdAt: user.createdAt.toISOString()
        }

        publishAuthUserRegisteredEvent(userdata);
        return {
            accessToken,
            refreshToken,
            user: userdata
        }
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
}


const createRefreshToken = async (userId: string, transaction?: Transaction) => {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_TTL_DAYS);

    const tokenId = crypto.randomUUID();
    const record = await RefreshToken.create({
        userId,
        tokenId,
        expiresAt
    }, { transaction });
    return record;
}