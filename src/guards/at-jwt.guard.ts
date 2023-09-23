import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class AtJwtGuard extends AuthGuard('jwt'){
    constructor(){
        super();
    }
}