import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class UserInterceptor implements NestInterceptor{
    constructor(private readonly authService: AuthService){}
    async intercept(context: ExecutionContext, next: CallHandler ){
        const request = context.switchToHttp().getRequest();
        const user = await this.authService.findOne(request.user.id);
        request.user = user;
        return next.handle();
    }
}