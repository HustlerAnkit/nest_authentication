import { Body, Controller, Post, UseGuards, Req, HttpCode, HttpStatus } from '@nestjs/common';

import { RegisterDTO } from './dto';
import { AuthService } from './auth.service';
import { AtJwtGuard, LocalAuthGuard, RtJwtGuard } from '../guards';
import { JwtPayload, Tokens } from 'src/types';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() details: RegisterDTO){
        return this.authService.register(details);
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Req() req): Promise<Tokens>{
        const user = req.user;
        return this.authService.login(user.id, user.email);
    }

    @UseGuards(AtJwtGuard)
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    logOut(@Req() req): Promise<boolean> {
        const id = req.user.id;
        return this.authService.logout(id);
    }

    @UseGuards(RtJwtGuard)
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@Req() req): Promise<Tokens>{
        const user = req.user;
        // console.log(user);
        const payload: JwtPayload = { id: user.id, email: user.email };
        return this.authService.refreshTokens(payload, user.refreshToken);
    }
}
