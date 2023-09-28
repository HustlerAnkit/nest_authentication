import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Follower, User, UserProfile } from 'src/config/entities';
import { Repository } from 'typeorm';
import { UserDetailsDTO } from './dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userModel: Repository<User>,
    @InjectRepository(Follower) private followerModel: Repository<Follower>,
    @InjectRepository(UserProfile) private userProfileModel: Repository<UserProfile>
  ) {}

  async findOne(id: number): Promise<User> {
    const user =  await this.userModel.findOne({
      where: [{ id }],
      relations: ['followers', 'followers.follower', 'following', 'following.following'],
    });
    if (!user) throw new NotFoundException('User not found.');
    return user;
  }

  async follow(followerId: number, userId: number): Promise<boolean> {
    await this.findOne(userId);
    const alreadyFollow = await this.followerModel.findOne({
      where: [{  followingId: userId, followerId }],
    });
    if (alreadyFollow)
      throw new BadRequestException('User is already being followed.');
    const newFollower = this.followerModel.create({
      followingId: userId,
      followerId
    });
    await this.followerModel.save(newFollower);
    return true;
  }

  async unfollow(followerId: number, userId: number): Promise<boolean> {
    await this.findOne(userId);
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
    await this.findOne(userId);
    const followers = await this.followerModel.find({
      where: [{ followingId: userId }],
      relations: ['follower'],
    });
    return followers;
  }

  async following(userId: number): Promise<Follower[] | []>{
    await this.findOne(userId);
    const following = await this.followerModel.find({
        where: [{ followerId: userId }],
        relations: ['following'],
    })
    return following;
  }

  async updateProfile(userId: number, userDetail: UserDetailsDTO, files: { profile: Express.Multer.File, cover: Express.Multer.File }): Promise<boolean>{
      // console.log(files.profile[0].path, files.cover[0].path);
      const user = await this.findOne(userId);
      if(!user.profile) {
        const newProfile = this.userProfileModel.create({
            address: userDetail.address,
            city: userDetail.city,
            state: userDetail?.state,
            country: userDetail.country,
            profileSource: files.profile[0].path,
            coverSource: files.cover[0].path,
            user
        })
        const profile = await this.userProfileModel.save(newProfile);
        await this.userModel.update({ id: user.id }, { profile });
      } else {
        await this.userProfileModel.update({ user }, {
          address: userDetail.address,
          city: userDetail.city,
          state: userDetail?.state,
          country: userDetail.country,
          profileSource: files.profile[0].path,
          coverSource: files.cover[0].path,
        });
      }
      return true;
  }
}
