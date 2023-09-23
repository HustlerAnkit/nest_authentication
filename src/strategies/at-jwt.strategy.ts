import { Injectable } from "@nestjs/common";
import { Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from "passport-jwt";
import { JwtPayload } from "src/types";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'at-secret',
          });
    }

    async validate(paylaod: JwtPayload): Promise<JwtPayload>{
        return paylaod;
    }
}