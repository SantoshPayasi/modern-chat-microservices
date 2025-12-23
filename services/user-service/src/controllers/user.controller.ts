import { userService } from "@/services/user.service";
import { CreateUserBody, SearchUserQuerySchema, UserIdParams } from "@/validations/user.schema";
import { type AsyncHandler } from "@chat-app/common";

export const getUser: AsyncHandler = async(req, res, next)=>{
    try {
        const {id} = req.params as unknown as UserIdParams;
        const user = await userService.getUserById(id);
        res.json({data: user})
    } catch (error) {
        next(error);
    }
}

export const getAllUsers:AsyncHandler = async(req,  res, next)=>{
    try{
      const users = await userService.geAllUsers();
      return res.status(200).json({data:users})
    }catch(error){
        next(error)
    }
}


export const createUser: AsyncHandler = async(req, res, next)=>{
    try {
        const payload = req.body as CreateUserBody;
        const user = userService.createUser(payload);
        return res.status(201).json({data:user});
    } catch (error) {
        next(error);
    }
}

export const searchUsers: AsyncHandler = async (req, res, next) =>{
try {
    

    const {query, limit, exclude} = req.query as unknown as SearchUserQuerySchema;

    const user = await userService.searchUsers({
        query,
        limit,
        excludeIds:exclude
    })

    return res.status(200).json({data: user});
} catch (error) {
    next(error)
}
}