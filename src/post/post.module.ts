import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Post, PostComment, PostLike, PostReport, User } from 'src/config/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ User, Post, PostLike, PostComment, PostReport ])],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
