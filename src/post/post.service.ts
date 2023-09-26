import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ParseIntPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Post,
  PostComment,
  PostLike,
  PostReport,
  User,
} from 'src/config/entities';
import { Repository } from 'typeorm';
import { CommentPostDTO, CreatePostDTO } from './dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private readonly postModel: Repository<Post>,
    @InjectRepository(User) private readonly userModel: Repository<User>,
    @InjectRepository(PostLike)
    private readonly likeModel: Repository<PostLike>,
    @InjectRepository(PostComment)
    private readonly commentModel: Repository<PostComment>,
    @InjectRepository(PostReport)
    private readonly reportModel: Repository<PostReport>,
  ) {}

  async index(userId: number): Promise<Post[] | []> {
    return this.postModel.find({ where: [{ userId }], relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user', 'reports', 'reports.user'] });
  }

  async create(userId: number, post: CreatePostDTO): Promise<Post> {
    const newPost = this.postModel.create({ ...post, userId });
    return this.postModel.save(newPost);
  }

  async findOne(postId: number): Promise<Post> {
    const post = await this.postModel.findOne({
      where: [{ id: postId }],
      relations: ['user', 'likes', 'likes.user', 'comments', 'comments.user', 'reports', 'reports.user'],
    });
    if (!post) throw new NotFoundException('Post not found.');
    return post;
  }

  async delete(postId: number, userId: number): Promise<boolean> {
    const post = await this.findOne(postId);
    if (post.userId !== userId) throw new UnauthorizedException();
    await this.postModel.delete({ id: postId });
    return true;
  }

  async like(postId: number, userId: number): Promise<boolean> {
    await this.findOne(postId);
    const alreadyLiked = await this.likeModel.findOne({ where: [{ userId, postId }] });
    if(alreadyLiked) throw new BadRequestException('You have already liked the post.')
    const like = this.likeModel.create({
      postId, userId
    });
    await this.likeModel.save(like);
    return true;
  }

  async dislike(postId: number, userId: number): Promise<boolean> {
    await this.findOne(postId);
    const alreadyLiked = await this.likeModel.findOne({ where: [{ userId, postId }] });
    if(!alreadyLiked) throw new BadRequestException('You have not liked the post at first place.')
    await this.likeModel.delete({ userId, postId });
    return true;
  }

  async report(postId: number, userId: number): Promise<boolean> {
    await this.findOne(postId);
    const alreadyReported = await this.reportModel.findOne({ where: [{ userId, postId }] });
    if(alreadyReported) throw new BadRequestException('You have already reported the post.')
    const report = this.likeModel.create({
      postId, userId
    });
    await this.reportModel.save(report);
    return true;
  }

  async postComment(postId: number, userId: number, comment: CommentPostDTO): Promise<boolean> {
    await this.findOne(postId);
    const newComment = this.commentModel.create({
      ...comment,
      userId,
      postId
    });
    await this.commentModel.save(newComment);
    return true;
  }

  async commentDelete(commentId: number, userId: number): Promise<boolean> {
    const comment = await this.commentModel.findOne({ where: [{ id: commentId }] });
    if(!comment) throw new BadRequestException('oops! something went wrong.')
    if(comment.userId !== userId) throw new UnauthorizedException();
    await this.commentModel.delete({ id: commentId });
    return true;
  }
}
