import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Follower, User, UserProfile } from 'src/config/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ User, Follower, UserProfile ])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
