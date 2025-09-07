import { FastifyInstance } from "fastify";
import { PrismaService } from "../../../database/prisma.service";
import { TasksService } from "../service/tasks.service";
import { TasksController } from "../controller/tasks.controller";

export function tasksRoutes(app: FastifyInstance) {

    const prismaService= new PrismaService()
    const taskService = new TasksService(prismaService)
    const tasksControlle = new TasksController(taskService)

    app.post("/tasks", tasksControlle.createTasks)
    app.get("/tasks", tasksControlle.getTasks)
    app.put("/tasks/:id", tasksControlle.updateTaks)
    app.delete("/tasks", tasksControlle.deleteTasks)
}