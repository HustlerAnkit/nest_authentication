import { Body, Controller, Post, UseGuards, Req, HttpCode, HttpStatus, Param, BadRequestException } from '@nestjs/common';

import { User } from 'src/config/entities';
import { LocalAuthGuard, RtJwtGuard } from '../config/guards';
import { AuthService } from './auth.service';
import { Publc } from 'src/config/decorators';
import { getRequestUserData } from 'src/config/decorators';
import { RegisterDTO, verifyAccountDTO } from './dto';
import { JwtPayload, Tokens } from 'src/config/types';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    @Publc(true)
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() details: RegisterDTO): Promise<{ hash: string }>{
        return this.authService.register(details);
    }

    @Post('verify-account/:hash')
    @Publc(true)
    @HttpCode(HttpStatus.OK)
    verify(@Param('hash') hash: string, @Body() cred: verifyAccountDTO): Promise<boolean>{
        return this.authService.verify(hash, cred);
    }

    @Post('resend-otp')
    @Publc(true)
    @HttpCode(HttpStatus.OK)
    resendOtp(@Body('email') email: string ): Promise<{ hash: string }>{
        if(!email) throw new BadRequestException('Email field is required.');
        return this.authService.resendOtp(email);
    }

    @Post('login')
    @Publc(true)
    @UseGuards(LocalAuthGuard)
    @HttpCode(HttpStatus.OK)
    login(@Req() req): Promise<Tokens>{
        const user = req.user;
        return this.authService.login(user.id, user.email);
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logOut(@getRequestUserData('id') id: number ): Promise<boolean> {
        return this.authService.logout(id);
    }

    @Post('refresh')
    @Publc(true)
    @UseGuards(RtJwtGuard)
    @HttpCode(HttpStatus.OK)
    refreshTokens(@getRequestUserData('id') id: number, @getRequestUserData('email') email: string, @getRequestUserData() user: User): Promise<Tokens>{
        const payload: JwtPayload = { id, email: email };
        return this.authService.refreshTokens(payload, user.refreshToken);
    }
}
