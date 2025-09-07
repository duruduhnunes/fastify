import { PrismaService } from "../../../database/prisma.service"
import { JwtService } from "./jwt.service"
import {user} from "../../../generated/prisma/index.js"
import {compare} from "bcrypt"

export interface AuthRequest {
    email: string
    password: string
}

interface AuthResponse{
    user_logged: user
    token: string
}

export class AuthService {
    constructor(private readonly prisma: PrismaService, private readonly jwtService: JwtService){}

    async auth({email,password}: AuthRequest): Promise<AuthResponse>{
      const user = await this.prisma.user.findUnique({
        where:{
            email
        }
      })

      if(!user){
        throw new Error("user not found")
      }

      const mathPassword = await compare(password, user.password)

      if(!mathPassword){
         throw new Error("user not found")
      }

      const payload = {
        sub: user.id,
        name: user.name,
        email:user.email
      }

      const token = this.jwtService.sign(payload,{
        expiresIn:"1d"
      })
    

      return{
        user_logged: user,
        token
      }
    }
}