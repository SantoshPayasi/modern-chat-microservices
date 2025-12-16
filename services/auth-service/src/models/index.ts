import { sequelize } from "@/db/sequelize";
import { UserCredentials } from "./user-credentials.model";
import { RefreshToken } from "./refresh-token.model";

export const initModels = async () => {
    await sequelize.sync();
}

export { UserCredentials, RefreshToken };
