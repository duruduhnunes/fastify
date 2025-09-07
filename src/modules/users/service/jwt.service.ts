import {JwtService as JwtServiceInterface} from "@nestjs/jwt"

export class JwtService extends JwtServiceInterface {
    constructor(){
        super({
            secret: process.env.SECRET_KEY,
            signOptions:{   
                expiresIn:"1d"
            }
        })
    }
}

