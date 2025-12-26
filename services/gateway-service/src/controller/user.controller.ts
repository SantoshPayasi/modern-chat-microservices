import { userProxyService } from "@/services/user-proxy.service";
import { getAuthenticatedUser } from "@/utils/auth";
import { createUserSchema, searchUserQuerySchema, userIdParamsSchema } from "@/validation/user.schema";
import { AsyncHandler } from "@chat-app/common";

export const getUser:AsyncHandler = async(req, res, next) =>{
    try {
        const payload = userIdParamsSchema.parse(req.params)
        const response = await userProxyService.getUserById(payload.id);
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}


export const getAllUsers:AsyncHandler = async(req, res, next) =>{
    try {
        const response = await userProxyService.getAllUsers();
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}


export const createUser:AsyncHandler = async(req, res, next) =>{
    try {
        const payload = createUserSchema.parse(req.body);
        const response = await userProxyService.createUsers(payload);
        res.status(201).json(response);
    } catch (error) {
        next(error);
    }
}

export const searchUsers:AsyncHandler = async(req, res, next) =>{
    try {
        const user = getAuthenticatedUser(req);
        const {query, limit, exclude} =  searchUserQuerySchema.parse(req.query);
        const senetizedExcludes = new Set([...exclude, user.id]);

        const response = await userProxyService.seatchUsers({query, limit, exclude});
        res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}