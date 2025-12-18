import { UserModel } from "@/db/models/user.model";
import { CreateUserInput, User } from "@/types/user";
import { AuthUserRegisteredPayload } from "@chat-app/common"
import { Op, WhereOptions } from "sequelize";


const toDomainUser = (model: UserModel): User => (
    {
        id: model.id,
        email: model.email,
        displayName: model.displayName,
        createdAt: model.createdAt,
        updatedAt: model.updatedAt
    }
)

export class UserRepository {

    async findById(id: string): Promise<User | null> {
        const user = await UserModel.findByPk(id);
        return user ? toDomainUser(user) : null;
    }

    async findAll(): Promise<User[]> {
        const users = await UserModel.findAll({
            order: [
                ["displayName", "asc"]
            ]
        });
        return users.map(toDomainUser);
    }

    async upsertFromAuthEvent(payload: AuthUserRegisteredPayload): Promise<User> {
        const [user] = await UserModel.upsert({
            id: payload.id,
            email: payload.email,
            displayName: payload.displayName,
            createdAt: new Date(payload.createdAt),
            updatedAt: new Date(payload.createdAt)
        }, { returning: true })
        return toDomainUser(user);
    }

    async create(data: CreateUserInput): Promise<User> {
        const user = await UserModel.create(data);
        return toDomainUser(user);
    }

    async searchByQuery(
        query: string,
        options: { limit?: number, excludeIds?: string[] } = {}
    ): Promise<User[]> {
        const where: WhereOptions = {
            [Op.or]: [
                { displayName: { [Op.like]: `%${query}%` } },
                { email: { [Op.like]: `%${query}%` } }
            ]
        }
        if (options.excludeIds?.length) {
            Object.assign(where, {
                id: { [Op.notIn]: options.excludeIds }
            })
        }
        const users = await UserModel.findAll({
            where,
            order: [
                ["displayName", "asc"]
            ],
            limit: options.limit ?? 10,
        });
        return users.map(toDomainUser);
    }
}


export const userRepository = new UserRepository();