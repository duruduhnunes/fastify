import { FastifyReply, FastifyRequest } from "fastify";
import { DeleteTasksRequest, TasksReply, TasksRequest, TasksService, TaskUpdateRequest } from "../service/tasks.service";


export class TasksController {
    constructor(
        private readonly tasksControlle: TasksService
    ) {}

    createTasks = async (req: FastifyRequest, res: FastifyReply) => {
        const {tittle, description, userId} =req.body as TasksRequest;
        const tasks = await this.tasksControlle.createTasks({
            
                userId,
                tittle, 
                description
            
        })
        
     return res.status(201).send(tasks)
    }

    getTasks = async (req: FastifyRequest, res: FastifyReply) => {
        const tasks = await this.tasksControlle.getTasks()
        return res.status(200).send({tasks})
    }

    updateTaks = async (req: FastifyRequest, res: FastifyReply) => {
        const { id} = req.params as TaskUpdateRequest
        const {tittle, description, userId} = req.body as TaskUpdateRequest
        const tasks = await this.tasksControlle.updateTasks({
            description,
            id,
            tittle,
            userId
        })
        return res.status(200).send(tasks)
    }

    deleteTasks = async (req: FastifyRequest, res: FastifyReply) => {
     const {id} = req.body as DeleteTasksRequest
         await this.tasksControlle.deleteUser({
           id
         }) 
         return  res.status(200).send({
            message: "Tarefa deletada com sucesso!"
         })    
        
    }
}