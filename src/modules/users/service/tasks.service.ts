import { PrismaService } from "../../../database/prisma.service";
import { Tasks } from "../../../generated/prisma/index.js";


export interface TasksRequest {
    tittle: string,
    description: string,
    userId: string
  

}
export interface TasksReply{
    tasks:Tasks
}

interface getTasks {
    tasks: Tasks[]
}
export interface TaskUpdateRequest {
    tittle: string,
    description: string,
    userId: string
      id: string
}
export interface TasksUpdateResponse {
    tasks: Tasks
}

export interface DeleteTasksRequest {
    id: string
}

interface DeleteTaskResponse {
    message: string
}

export class TasksService {
    constructor(
        private readonly taskService: PrismaService
    ) {}
    async createTasks({tittle, description, userId}: TasksRequest): Promise<TasksReply> {
        const tasks = await this.taskService.tasks.create({
            data: {
                description,
                tittle,
                userId
            }
        })
        return {tasks}

    }

    async getTasks(): Promise<getTasks> {
        const tasks = await this.taskService.tasks.findMany()

        return {
            tasks
        }
    }

    async updateTasks({description,id, tittle, userId}: TaskUpdateRequest): Promise<TasksUpdateResponse> {
        const tasksUpdate =  await this.taskService.tasks.update({
            where: {id},
            data: {
                description,
                tittle,
                userId,
                
            }
        })
       
        return {
           tasks: tasksUpdate
        }
    }

    async deleteUser({id}: DeleteTasksRequest): Promise<DeleteTaskResponse> {
         this.taskService.tasks.delete({
            where: {
                id
            }
        })
        return {
          message: ""
        }
        
    }
  
}