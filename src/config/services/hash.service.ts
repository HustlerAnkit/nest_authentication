import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

@Injectable()
export class HashService {
    constructor(private readonly configService: ConfigService){}
    hashOtp(toHash: string){
        const hash = crypto.createHmac('sha256', this.configService.get('HASH_SECRET')).update(toHash).digest('hex');
        return hash;
    }
}