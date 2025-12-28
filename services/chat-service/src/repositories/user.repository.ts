import { getMongoClient } from "@/client/mongo.client";
import type { UserCreatedPayload } from "@chat-app/common";
import type { Collection } from "mongodb";


const CLOOECTION_NAME = 'users';
const getCollection = async (): Promise<Collection<UserDocument>> => {
    const client = await getMongoClient();
    return client.db().collection<UserDocument>(CLOOECTION_NAME);
}




interface UserDocument {
    _id: string;
    email: string;
    displayName: string;
    createdAt: string;
    updatedAt: string;
}


export const userRepository = {
    async upsertUser(payload: UserCreatedPayload) {
        const collection = await getCollection();
        await collection.updateOne(
            { _id: payload.id },
            {
                $set: {
                    _id: payload.id,
                    email: payload.email,
                    displayName: payload.displayName,
                    updatedAt: new Date().toISOString()
                }
            },
            {
                upsert: true
            }
        )
    },

    async findUserById(id: string): Promise<UserDocument | null> {
        const collection = await getCollection();
        return collection.findOne({ _id: id });
    }

}