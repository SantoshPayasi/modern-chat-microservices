import { createUser, getAllUsers, getUser, searchUsers } from "@/controllers/user.controller";
import { createUserSchema, searchUserQuerySchema, userIdParamsSchema } from "@/validations/user.schema";
import { asyncHandler, validateRequest } from "@chat-app/common";
import { Router } from "express";


export const userRoutes: Router = Router();

userRoutes.get('/', asyncHandler(getAllUsers));
userRoutes.get('/search', validateRequest({query:searchUserQuerySchema}), asyncHandler(searchUsers));
userRoutes.get('/:id', validateRequest({params:userIdParamsSchema}), asyncHandler(getUser));
userRoutes.post('/', validateRequest({body:createUserSchema}), asyncHandler(createUser));