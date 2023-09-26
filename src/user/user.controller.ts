import { BadRequestException, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from '@nestjs/common';
import { getRequestUserData } from 'src/config/decorators';
import { Follower, User } from 'src/config/entities';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get('my-detail')
    myDetail(@getRequestUserData('id', ParseIntPipe) id: number): Promise<User | null>{
        return this.userService.findOne(id);
    }

    @Get(':id')
    userDetail(@Param('id', ParseIntPipe) id: number ): Promise<User>{
        return this.userService.findOne(id);
    }

    @Post('follow/:id')
    @HttpCode(HttpStatus.OK)
    follow(@getRequestUserData('id', ParseIntPipe) followerId: number, @Param('id', ParseIntPipe) userId: number): Promise<boolean>{
        if(followerId === userId) throw new BadRequestException('Something unusual happened.');
        return this.userService.follow(followerId, userId)
    }

    @Post('unfollow/:id')
    @HttpCode(HttpStatus.OK)
    unfollow(@getRequestUserData('id', ParseIntPipe) followerId: number, @Param('id', ParseIntPipe) userId: number): Promise<boolean>{
        if(followerId === userId) throw new BadRequestException('Something unusual happened.');
        return this.userService.unfollow(followerId, userId);
    }

    @Post('followers/:id')
    @HttpCode(HttpStatus.OK)
    followers(@Param('id', ParseIntPipe) userId: number): Promise<Follower[] | []>{
        return this.userService.followers(userId);
    }

    @Post('following/:id')
    @HttpCode(HttpStatus.OK)
    following(@Param('id', ParseIntPipe) userId: number): Promise<Follower[] | []>{
        return this.userService.following(userId);
    }
}
