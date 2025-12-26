import { AuthnticatedUser } from "@chat-app/common";

declare global {
    namespace Express {
        interface Request {
            user?: AuthnticatedUser
        }
    }
}

export {};