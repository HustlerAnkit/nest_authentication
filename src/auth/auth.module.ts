import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from 'src/config/entities';
import { AtStrategy, LocalStrategy, RtStrategy } from '../config/strategies';
import { HashService, OtpService } from 'src/config/services';

@Module({
  imports: [TypeOrmModule.forFeature([ User ]), PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, AtStrategy, RtStrategy, HashService, OtpService],
  exports: [AuthService]
})
export class AuthModule {}
