import { JwtService } from "@nestjs/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export class Guard {
  constructor(
    private readonly request: FastifyRequest,
    private readonly reply: FastifyReply,
    private readonly jwt: JwtService
  ) {}

  async canActivate(): Promise<boolean> {
    const bearerToken = this.request.headers.authorization;
    if (!bearerToken) {
      return this.reply.status(401).send({ message: "Unauthorized" });
    }

    const token = bearerToken.split(" ")[1];
    const decoded = this.jwt.verify(token);
    if (!decoded) {
      return this.reply.status(401).send({ message: "Unauthorized" });
    }
    return true;
  }
}
