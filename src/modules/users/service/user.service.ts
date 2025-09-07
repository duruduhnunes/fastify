import { FastifyError } from "fastify";
import { PrismaService } from "../../../database/prisma.service";
import {user} from "../../../generated/prisma/index.js"
import { hash } from "bcrypt";

export interface UserCreateRequest{
    name:string
    email:string
    password:string
}


interface UserCreateResponse{
    user: user
}
interface GetUsersResponse{
    users: user[]
}
interface UserUpdateResponse {
 users: user
}
export interface UpdateUsersRequest {
      id: string
    name: string
    email: string
    password: string
}
interface DeleteUser {
    message: string
}
export interface DeleteUserRequest {
    id: string
}

export interface FindUserResponse {
    userOne: user
}

export interface FindUserIdRequest {
    id: string
}

export class UserService{
    constructor(private readonly prisma: PrismaService){}

    async createUsers({email,name,password}:UserCreateRequest): Promise<UserCreateResponse>{
        
        const userExists = await this.prisma.user.findUnique({
            where:{email}
        })
        
      if (userExists) {
    const error: FastifyError = {
      name: 'EmailExistsError',
      message: 'Email já existe',
      statusCode: 406,
    } as FastifyError;

    throw error;
  }

       const passwordHash = await hash(password, 6)
         
        const user = await this.prisma.user.create({
            data:{
               name,
               email,
               password: passwordHash
            }
        })
       
        return{
            user
        }
    }


    async getUsers(): Promise<GetUsersResponse>{
        const users = await this.prisma.user.findMany()
        return {
            users
        }
    }
    async getUserById({ id }: FindUserIdRequest): Promise<FindUserResponse> {
        const userOne = await this.prisma.user.findUnique({
            where: { id}
        })
        if (!userOne){
            throw new Error("user not found")
        }
        return { userOne }
    }

    async updateUsers({id,email,name,password}: UpdateUsersRequest): Promise<UserUpdateResponse> {
        const users = await this.prisma.user.update({
           where:{id},
         data: {
            name,
            email,
            password
         }
        })
        return {users}
    }
    async deleteUser({id}: DeleteUserRequest): Promise<DeleteUser>{
       await this.prisma.user.delete({
            where: {
                id
            }, 
        })
    return {
        message:"user delected with success"
    }
    }
    
}

