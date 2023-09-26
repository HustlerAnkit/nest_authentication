import { Body, Controller, Post, UseGuards, Req, HttpCode, HttpStatus, Get } from '@nestjs/common';

import { RegisterDTO } from './dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard, RtJwtGuard } from '../config/guards';
import { JwtPayload, Tokens } from 'src/config/types';
import { Publc } from 'src/config/decorators';
import { User } from 'src/config/entities';
import { getRequestUserData } from 'src/config/decorators';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    @Publc(true)
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() details: RegisterDTO): Promise<User>{
        return this.authService.register(details);
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
