import type { UserRepository } from "@/repository/user.repositories";
import { User, CreateUserInput } from "@/types/user"
import { userRepository } from "@/repository/user.repositories";
import { AuthUserRegisteredPayload, HttpError } from "@chat-app/common";
import { UniqueConstraintError } from "sequelize";
import { publishUserCreatedEvent } from "@/messaging/event-publisher";


class UserService {
    constructor(private readonly repository: UserRepository) { }

    async getUserById(id: string): Promise<User | null> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new HttpError(404, "User not found");
        }
        return user;
    }

    async geAllUsers(): Promise<User[]> {
        return this.repository.findAll();
    }

    async createUser(data: CreateUserInput): Promise<User> {
        try {
            const user = await this.repository.create(data);

            void publishUserCreatedEvent({
                id: user.email,
                email:user.email,
                createdAt:user.createdAt,
                displayName:user.displayName
            })

            return user;
        } catch (error) {
            if (error instanceof UniqueConstraintError) {
                throw new HttpError(409, "User already exists");
            }
            throw error;
        }
    }

    async searchUsers(params: { query: string, limit?: number, excludeIds?: string[] }): Promise<User[]> {
        const query = params.query.trim();
        if (query.length === 0) {
            return [];
        }
        const users = await this.repository.searchByQuery(query, {
            limit: params.limit,
            excludeIds: params.excludeIds
        });
        return users;
    }

    async syncFromAuthUser(payload: AuthUserRegisteredPayload): Promise<User> {
        const user = await this.repository.upsertFromAuthEvent(payload);
         void publishUserCreatedEvent({
                id: user.email,
                email:user.email,
                createdAt:user.createdAt,
                displayName:user.displayName
            })
        return user;
    }
}


export const userService = new UserService(userRepository);