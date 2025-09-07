import { FastifyReply, FastifyRequest } from "fastify";
import { AuthRequest, AuthService } from "../service/auth.service";




export class AuthController {
    constructor(
        private readonly service: AuthService
    ){}

    auth = async(req: FastifyRequest, res: FastifyReply) => {
        const {email, password} = req.body as AuthRequest
        const auth = await this.service.auth({
            email,
            password
        })

        return res.status(200).send(auth)
    }
}