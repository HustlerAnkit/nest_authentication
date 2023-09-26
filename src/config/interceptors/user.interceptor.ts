import { Injectable, NestInterceptor, CallHandler, ExecutionContext } from "@nestjs/common";
import { UserService } from "src/user/user.service";

@Injectable()
export class UserInterceptor implements NestInterceptor{
    constructor(private readonly userService: UserService){}
    async intercept(context: ExecutionContext, next: CallHandler ){
        const request = context.switchToHttp().getRequest();
        const user = await this.userService.findOne(request.user.id);
        request.user = user;
        return next.handle();
    }
}