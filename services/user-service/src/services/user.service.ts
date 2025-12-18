import type { UserRepository } from "@/repository/user.repositories";
import { User, CreateUserInput } from "@/types/user"
import { userRepository } from "@/repository/user.repositories";
import { AuthUserRegisteredPayload } from "@chat-app/common";


class UserService {
    constructor(private readonly repository: UserRepository) { }

    async syncFromAuthUser(payload: AuthUserRegisteredPayload): Promise<User> {
        const user = await this.repository.upsertFromAuthEvent(payload);
        return user;
    }
}


export const userService = new UserService(userRepository);