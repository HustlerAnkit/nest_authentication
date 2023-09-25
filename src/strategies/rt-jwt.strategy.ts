import { Injectable } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import { JwtPayloadRt, JwtPayload } from "src/types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(protected readonly configService: ConfigService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_REFRESH_SECRET'),
            passReqToCallback: true
          });
    }

    async validate(req: Request, paylaod: JwtPayload): Promise<JwtPayloadRt>{
        const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();
        return {...paylaod, refreshToken };
    }
}