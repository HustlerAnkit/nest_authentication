import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Body,
  UseInterceptors,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { getRequestUserData } from 'src/config/decorators';
import { Follower, User } from 'src/config/entities';
import { UserService } from './user.service';
import { UserDetailsDTO } from './dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('my-detail')
  myDetail(
    @getRequestUserData('id', ParseIntPipe) id: number,
  ): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Get(':id')
  userDetail(@Param('id', ParseIntPipe) id: number): Promise<User> {
    return this.userService.findOne(id);
  }

  @Post('follow/:id')
  @HttpCode(HttpStatus.OK)
  follow(
    @getRequestUserData('id', ParseIntPipe) followerId: number,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<boolean> {
    if (followerId === userId)
      throw new BadRequestException('Something unusual happened.');
    return this.userService.follow(followerId, userId);
  }

  @Post('unfollow/:id')
  @HttpCode(HttpStatus.OK)
  unfollow(
    @getRequestUserData('id', ParseIntPipe) followerId: number,
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<boolean> {
    if (followerId === userId)
      throw new BadRequestException('Something unusual happened.');
    return this.userService.unfollow(followerId, userId);
  }

  @Post('followers/:id')
  @HttpCode(HttpStatus.OK)
  followers(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Follower[] | []> {
    return this.userService.followers(userId);
  }

  @Post('following/:id')
  @HttpCode(HttpStatus.OK)
  following(
    @Param('id', ParseIntPipe) userId: number,
  ): Promise<Follower[] | []> {
    return this.userService.following(userId);
  }

  @Put('update-profile')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'profile', maxCount: 1 },
        { name: 'cover', maxCount: 1 },
      ],
      {
        storage: diskStorage({
          destination: 'public/images',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      },
    ),
  )
  updateProfile(
    @getRequestUserData('id', ParseIntPipe) userId: number,
    @Body() userDetails: UserDetailsDTO,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
        //   new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 4 }),
        //   new FileTypeValidator({ fileType: 'image/JPEG|image/jpg|image/png' }),
        ],
      }),
    )
    files: { profile: Express.Multer.File; cover: Express.Multer.File },
  ): Promise<boolean> {
    return this.userService.updateProfile(userId, userDetails, files);
  }
}
