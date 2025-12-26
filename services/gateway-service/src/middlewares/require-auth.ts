import { HttpError , type AuthnticatedUser} from "@chat-app/common";
import jwt from "jsonwebtoken";
import {RequestHandler} from "express";
import { env } from "@/config/env";

interface AccessTokenClaims {
    sub:string,
    email?:string
}

const parseAuthorizarionToken = (value:string| undefined):string =>{
   if(!value){
    throw new HttpError(401, "Unauthorized");
   }

   const [scheme, token] = value.split(" ");

   if(scheme.toLocaleLowerCase()!='bearer' || !token){
    throw new HttpError(401, 'Unauthorized');
   }

   return token;
}

const toAuthenticatedUser = (claims:AccessTokenClaims):AuthnticatedUser =>{
    if(!claims.sub){
        throw new HttpError(401, 'Unauthorized');
    }
    return {
        id:claims.sub,
        email:claims.email
    }
}


export const requireAuth:RequestHandler = (req, _res, next) =>{
    try {
        const token = parseAuthorizarionToken(req.headers.authorization);
        const claims = jwt.verify(token, env.JWT_SECRET) as AuthnticatedUser;
        req.user = claims;
    } catch (error) {
        if(error instanceof HttpError){
            next(error);
            return;
        }
        next(new HttpError(401, 'Unauthorized'));
    }
}