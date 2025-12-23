import {HttpError, type AuthnticatedUser} from "@chat-app/common";


import type { Request } from "express";

export const getAuthenticatedUser = (req:Request):AuthnticatedUser =>{
    if(!req.user){
        throw new HttpError(401, 'Unauthenticated user');
    }
    return req.user;
}