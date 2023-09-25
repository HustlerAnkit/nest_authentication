import {
  BadRequestException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterDTO } from './dto';
import { User } from 'src/config/entities';
import { JwtPayload, Tokens } from 'src/config/types';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userModel: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(register: RegisterDTO): Promise<User> {
    const unique = await this.userModel.findOne({
      where: [{ username: register.username }, { email: register.email }],
    });

    if (unique) {
      if (unique.username === register.username) {
        throw new BadRequestException('username is already taken');
      } else if (unique.email === register.email) {
        throw new BadRequestException('email is already taken');
      }
    }

    const genSalt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(register.password, genSalt);
    register.password = hashedPass;
    const newUser = this.userModel.create({
      ...register,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return await this.userModel.save(newUser);
  }

  async login(id: number, email: string): Promise<Tokens> {
    const { refresh_token: refreshToken, access_token: accessToken } =
      await this.generateToken(id, email);
    await this.userModel.update({ id }, { refreshToken });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async generateToken(id: number, email: string): Promise<Tokens> {
    const payload: JwtPayload = { id, email };
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userModel.findOne({ where: [{ email: email }] });

    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async refreshTokens(
    payload: JwtPayload,
    refreshToken: string,
  ): Promise<Tokens> {
    const user = await this.userModel.findOne({ where: [{ id: payload.id }] });

    if (!user) {
      throw new ForbiddenException('Access Denied');
    }

    if (user.refreshToken !== refreshToken) {
      throw new ForbiddenException('Access Denied');
    }

    const { refresh_token, access_token } = await this.generateToken(
      payload.id,
      payload.email,
    );
    await this.userModel.update(
      { id: payload.id },
      { refreshToken: refresh_token },
    );
    return {
      access_token,
      refresh_token,
    };
  }

  async findOne(id: number): Promise<User>{
      return await this.userModel.findOne({ where: [{ id }] });
  }

  async logout(id: number): Promise<boolean> {
    await this.userModel.update({ id }, { refreshToken: null });
    return true;
  }
}
