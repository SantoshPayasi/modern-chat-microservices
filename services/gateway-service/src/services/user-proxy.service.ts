import { env } from "@/config/env";
import { HttpError } from "@chat-app/common";
import axios from "axios";

const client = axios.create({
    baseURL: env.USER_SERVICE_URL,
    timeout:5000
});

const authHeader = {
    headers:{
        'X-Internal-Token': env.INTERNAL_API_TOKEN
    }
};

export interface UserDto {
    is:string;
    email:string;
    displayName:string;
    createdAt:string;
    updatedAt:string;
}

export interface UserResponse {
    data:UserDto
}

export interface UserListResponse {
    data: UserDto[];
}

export interface CreateUserPayload {
    email:string;
    displayName:string;
}

export interface SearchUserParams {
  query:string;
  limit?:number;
  exclude?:string[]
}


const resolvedMessages = (status: number, data: unknown): string => {
    if (typeof data == "object" && data && "message" in data) {
        const message = (data as Record<string, unknown>).message;
        if (typeof message == "string" && message.trim().length > 0) {
            return message;
        }
    }
    return status >= 500 ? "User service is unavailable" : "Something went wrong";
}

export const handleAxiosError = (error: unknown): never => {
    if (!axios.isAxiosError(error) || !error.response) {
        throw new HttpError(500, "User service is unavailable");
    }
    const { status, data } = error.response as { status: number, data: unknown };
    throw new HttpError(status, resolvedMessages(status, data));
}


export const userProxyService = {
   getUserById : async(id:string):Promise<UserResponse> =>{
      try {
        const response = await client.get<UserResponse>(`/users/${id}`, authHeader);
        return response.data;
      } catch (error) {
        return handleAxiosError(error);
      }
   },

   getAllUsers: async():Promise<UserListResponse> =>{
      try {
        const response = await client.get('/users/', authHeader);
        return response.data;
      } catch (error) {
        return handleAxiosError(error);
      }
   },
   createUsers: async(payload:CreateUserPayload):Promise<UserResponse>=>{
    try {
        const response = await client.post('/users', payload, authHeader);
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
   },
   seatchUsers: async(params:SearchUserParams):Promise<UserListResponse>=>{
    try {
            const response = await client.get('/users/search', {
            headers:authHeader.headers,
            params:{
                query:params.query,
                ...(params.limit ? {limit:params.limit}:{}),
                ...(params.exclude? {exclude:params.exclude}:{})
            }
        })
        return response.data;
    } catch (error) {
        return handleAxiosError(error);
    }
   
   }
}

