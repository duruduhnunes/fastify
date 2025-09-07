import { FastifyInstance } from "fastify";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { PrismaService } from "../../../database/prisma.service";

export function userRoutes(app: FastifyInstance){

const prismaService = new PrismaService()
const userService = new UserService(prismaService)
const userController = new UserController(userService)

app.post("/users",  userController.createUser),
app.get("/users", userController.getUsers),
app.put("/update", userController.updateUsers)
app.delete("/delete", userController.deleteUsers)

}

