import {
  Controller,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Body,
  Get,
} from '@nestjs/common';
import { Post as PostEntity } from 'src/config/entities';
import { PostService } from './post.service';
import { CommentPostDTO, CreatePostDTO } from './dto';
import { getRequestUserData } from 'src/config/decorators';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  index(
    @getRequestUserData('id', ParseIntPipe) userId: number,
  ): Promise<PostEntity[] | []> {
    return this.postService.index(userId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) postId: number,
  ): Promise<PostEntity> {
    return this.postService.findOne(postId);
  }

  @Post()
  create(
    @Body() post: CreatePostDTO,
    @getRequestUserData('id', ParseIntPipe) userId: number,
  ): Promise<PostEntity> {
    return this.postService.create(userId, post);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', ParseIntPipe) postId: number,
    @getRequestUserData('id') userId: number,
  ): Promise<boolean> {
    return this.postService.delete(postId, userId);
  }

  @Post('like/:id')
  @HttpCode(HttpStatus.OK)
  like(
    @Param('id', ParseIntPipe) postId: number,
    @getRequestUserData('id', ParseIntPipe) userId: number,
  ): Promise<boolean> {
    return this.postService.like(postId, userId);
  }

  @Post('dislike/:id')
  @HttpCode(HttpStatus.OK)
  dislike(
    @Param('id', ParseIntPipe) postId: number,
    @getRequestUserData('id', ParseIntPipe) userId: number,
  ): Promise<boolean> {
    return this.postService.dislike(postId, userId);
  }

  @Post('report/:id')
  @HttpCode(HttpStatus.OK)
  report(
    @Param('id', ParseIntPipe) postId: number,
    @getRequestUserData('id', ParseIntPipe) userId: number,
  ): Promise<boolean> {
    return this.postService.report(postId, userId);
  }

  @Post('comment/:id')
  @HttpCode(HttpStatus.OK)
  postComment(@Param('id', ParseIntPipe) postId: number, @getRequestUserData('id', ParseIntPipe) userId: number, @Body() comment: CommentPostDTO){
    return this.postService.postComment(postId, userId, comment);
  }

  @Delete('comment/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  commentDelete(@Param('id', ParseIntPipe) commentId: number, @getRequestUserData('id') userId: number){
    return this.postService.commentDelete(commentId, userId);
  }
}
