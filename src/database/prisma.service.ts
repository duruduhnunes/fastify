import { PrismaClient } from "../generated/prisma/index.js";

export class PrismaService extends PrismaClient {
    constructor(){
        super({
         log:["error","info","query","warn"]
        })
    }

  async onInit(){
    await this.$connect()
  }
}