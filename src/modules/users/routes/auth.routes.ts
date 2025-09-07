import { FastifyInstance } from "fastify";
import { PrismaService } from "../../../database/prisma.service";
import { AuthService } from "../service/auth.service";
import { JwtService } from "../service/jwt.service";
import { AuthController } from "../controller/auth.controller";



export function AuthFunction(app: FastifyInstance) {

    const prismaService = new PrismaService()
    const jwtService = new JwtService()
    const authService = new AuthService(prismaService, jwtService)
    const authController = new AuthController(authService)


    app.post("/auth", authController.auth)
}