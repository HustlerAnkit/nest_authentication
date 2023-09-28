import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { template } from 'handlebars';
import { User } from 'src/config/entities';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService, private readonly configService: ConfigService){}

    async sendVerificationOTP(user: User, otp: number){
        await this.mailerService.sendMail({
            to: user.email,
            subject: `Welcome to ${this.configService.get('APP_NAME')}! confirm your account.`,
            template: 'verify-account',
            context: {
                name: user.username,
                otp,
                appName: this.configService.get('APP_NAME')
            }
        })
    }
}
