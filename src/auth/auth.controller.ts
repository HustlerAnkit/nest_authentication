import { Body, Controller, Post } from '@nestjs/common';
import { LoginDTO, RegisterDTO } from './dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('register')
    signUp(@Body() details: RegisterDTO){
        return this.authService.register(details);
    }

    @Post('login')
    login(@Body() credential: LoginDTO){
        return this.authService.login(credential);
    }

    @Post('logout')
    logOut(){
        
    }
}
