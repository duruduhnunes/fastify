import { DeleteUserRequest, UpdateUsersRequest, UserService } from "../service/user.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { UserCreateRequest } from "../service/user.service";
import { Guard } from "../guard/guard";
import { JwtService } from "@nestjs/jwt";


export class UserController{
    constructor(private readonly userService: UserService){}

    

    createUser = async (req: FastifyRequest, res: FastifyReply) =>{

       const {email, name, password} = req.body as UserCreateRequest
        const user = await this.userService.createUsers({
            email,
            name,
            password
        })
         
        return res.status(201).send(user)
    }

   

    getUsers = async (req: FastifyRequest, res: FastifyReply) => {
        const guard = new Guard(req, res, new JwtService({ secret: process.env.SECRET_KEY as string }));
        const isAuthentcated = await guard.canActivate();
        if (!isAuthentcated) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        const users = await this.userService.getUsers()
        return res.status(200).send({
            users
        })
    
    }

    getFindOneUser = async (req: FastifyRequest, res: FastifyReply) => {
        const { id} = req.params as { id: string}
        const userOne = await this.userService.getUserById({ id})
        if (!userOne) {
            return res.status(404).send({ message: "Usuário não encontrado"})
        }

        return res.status(200).send({
            userOne
        })
    }

    updateUsers = async (req: FastifyRequest, res: FastifyReply) => {
        const { email, name, password, id} = req.body as UpdateUsersRequest
        const updateUsers = await this.userService.updateUsers({
          email,
          id,
          name,
          password
        })
        return res.status(200).send({
            updateUsers
        })
    }

    deleteUsers = async (req: FastifyRequest,  res: FastifyReply) => {
        const { id} = req.body as DeleteUserRequest
         await this.userService.deleteUser({id})
        return  res.status(200).send({
            message: "usuario deletado"
        })
    }
}