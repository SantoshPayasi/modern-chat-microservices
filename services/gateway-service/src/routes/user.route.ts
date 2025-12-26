import { createUser, getAllUsers, getUser, searchUsers } from "@/controller/user.controller";
import { requireAuth } from "@/middlewares/require-auth";
import { createUserSchema, searchUserQuerySchema, userIdParamsSchema } from "@/validation/user.schema";
import { asyncHandler, validateRequest } from "@chat-app/common";
import { Router } from "express";

export const userRoutes:Router = Router();


userRoutes.get("/", requireAuth, asyncHandler(getAllUsers) );
userRoutes.get('/search', requireAuth, validateRequest({query:searchUserQuerySchema}), asyncHandler(searchUsers));
userRoutes.get('/:id', requireAuth, validateRequest({params:userIdParamsSchema}), asyncHandler(getUser));
userRoutes.post('/', requireAuth, validateRequest({body:createUserSchema}), asyncHandler(createUser));
