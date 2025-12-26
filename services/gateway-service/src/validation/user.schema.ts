import { z } from "@chat-app/common";

export const createUserSchema = z.object({
    email:z.string().email(),
    displayName:z.string().min(3).max(255)
})

export const userIdParamsSchema = z.object({
    id: z.string().uuid()
})

export const excludeSchema = z.union([
z.array(z.string().uuid()), 
z
.string()
.uuid()
.transform((value)=>[value])
.optional()
.transform((value)=> value ?? [])]
)


export const searchUserQuerySchema = z.object({
    query:z.string().trim().min(3).max(255),
    limit:z.
            union([z.string(), z.number()])
            .transform((value)=>Number())
            .refine((value)=>Number.isInteger(value)&& value>0 && value<=25, {
                message:"Limit must be between 1 to 25"
            })
            .optional(),
    exclude:excludeSchema
})


export type SearchUserQuerySchema = z.infer<typeof searchUserQuerySchema>;
export type CreateUserBody = z.infer<typeof createUserSchema>;
export type UserIdParams = z.infer<typeof userIdParamsSchema>;