import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower, User } from 'src/config/entities';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userModel: Repository<User>,
    @InjectRepository(Follower) private followerModel: Repository<Follower>,
  ) {}

  async findOne(id: number): Promise<User | null> {
    return await this.userModel.findOne({
      where: [{ id }],
      relations: ['followers', 'followers.follower', 'following', 'following.following'],
    });
  }

  async follow(followerId: number, userId: number): Promise<boolean> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found.');
    const alreadyFollow = await this.followerModel.findOne({
      where: [{  followingId: userId, followerId }],
    });
    if (alreadyFollow)
      throw new BadRequestException('User is already being followed.');
    const newFollower = this.followerModel.create({
      followingId: userId,
      followerId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.followerModel.save(newFollower);
    return true;
  }

  async unfollow(followerId: number, userId: number): Promise<boolean> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found.');
    const check = await this.followerModel.findOne({
      where: [{ followingId: userId, followerId }],
    });
    if (!check)
      throw new BadRequestException('You are not following the user.');
    await this.followerModel.delete({
      followingId: userId,
      followerId,
    });
    return true;
  }

  async followers(userId: number): Promise<Follower[] | []> {
    const user = await this.findOne(userId);
    if (!user) throw new NotFoundException('User not found.');
    const followers = await this.followerModel.find({
      where: [{ followingId: userId }],
      relations: ['follower'],
    });
    return followers;
  }

  async following(userId: number): Promise<Follower[] | []>{
    const user = await this.findOne(userId);
    if(!user) throw new NotFoundException('User not found.');
    const following = await this.followerModel.find({
        where: [{ followerId: userId }],
        relations: ['following'],
    })
    return following;
  }
}
