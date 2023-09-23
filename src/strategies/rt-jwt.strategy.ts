import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt } from "passport-jwt";
import { JwtPayloadRt, JwtPayload } from "src/types";

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: 'rt-secret',
            passReqToCallback: true
          });
    }

    async validate(req: Request, paylaod: JwtPayload): Promise<JwtPayloadRt>{
        const refreshToken = req?.get('authorization')?.replace('Bearer', '').trim();
        return {...paylaod, refreshToken };
    }
}