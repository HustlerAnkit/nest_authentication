import {
  BadRequestException,
  BadGatewayException,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { LoginDTO, RegisterDTO, verifyAccountDTO } from './dto';
import { User } from 'src/config/entities';
import { JwtPayload, Tokens } from 'src/config/types';
import { MailService } from 'src/mail/mail.service';
import { HashService, OtpService } from 'src/config/services';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userModel: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
    private readonly otpService: OtpService,
    private readonly hashService: HashService
  ) {}

  async register(register: RegisterDTO): Promise<{ hash: string }> {
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
      ...register
    });
    const user = await this.userModel.save(newUser);

    const otp = this.otpService.generateOtp();
    const ttl = this.configService.get('OTP_EXPIRATION_SECONDS', 60) * 1000;
    const expiresIn = Date.now() + ttl;
    const toHash = `${user.email}.${otp}.${expiresIn}`;
    const hash = this.hashService.hashOtp(toHash);

    await this.mailService.sendVerificationOTP(user, otp);

    return { hash: `${hash}.${expiresIn}` }
  }

  async verify(hash: string, cred: verifyAccountDTO): Promise<boolean>{
    const [hashedOtp, expiresIn] = hash.split('.');
    if(Date.now() > +expiresIn){
      throw new BadRequestException('OTP is already expired.')
    }
    const toHash = `${cred.email}.${cred.otp}.${expiresIn}`;
    const isValid = this.otpService.verifyOtp(toHash, hashedOtp);
    if(!isValid) throw new BadRequestException('Invalid OTP.')

    const user = await this.userModel.findOne({ where: [{ email: cred.email }]});
    if(!user) throw new BadRequestException('Oops... something unexpected happend.')

    await this.userModel.update({ id: user.id }, {
      emailVerifiedAt: new Date()
    });
    return true;
  }

  async resendOtp(email: string): Promise<{ hash: string }>{
      const user = await this.userModel.findOneBy({ email });
      if(!user) throw new BadRequestException('No user found.')

      const otp = this.otpService.generateOtp();
      const ttl = this.configService.get('OTP_EXPIRATION_SECONDS', 60) * 1000;
      const expiresIn = Date.now() + ttl;
      const toHash = `${user.email}.${otp}.${expiresIn}`;
      const hash = this.hashService.hashOtp(toHash);

      await this.mailService.sendVerificationOTP(user, otp);

      return { hash: `${hash}.${expiresIn}` }
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

  async logout(id: number): Promise<boolean> {
    await this.userModel.update({ id }, { refreshToken: null });
    return true;
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

  async validateUser(cred: LoginDTO): Promise<User | null> {
    const user = await this.userModel.findOne({ where: [{ email: cred.email }] });
    if(user) {
      if(!user.emailVerifiedAt) throw new BadRequestException('Please verify your account first.');
      if (await bcrypt.compare(cred.password, user.password)) {
        return user;
      }
    }
    return null;
  }
}
