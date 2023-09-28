import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { HashService } from './hash.service';

@Injectable()
export class OtpService {
    constructor(private readonly hashService: HashService){}

    generateOtp() {
        const otp = crypto.randomInt(1000, 9999);
        return otp;
    }

    verifyOtp(toHash, hashedOtp) {
        const newHash = this.hashService.hashOtp(toHash);
        return newHash === hashedOtp;
    }
}