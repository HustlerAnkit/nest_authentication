import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from "passport-jwt";
import { JwtPayload } from "src/config/types";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(protected readonly configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_ACCESS_SECRET'),
          });
    }

    async validate(paylaod: JwtPayload): Promise<JwtPayload>{
        return paylaod;
    }
}