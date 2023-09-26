import { Injectable } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";
import { Follower, Post, PostComment, PostLike, PostReport, User } from "../entities";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService){}
    createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return {
            type: 'mysql',
            host: this.configService.get('DB_HOST'),
            username: this.configService.get('DB_USERNAME'),
            password: this.configService.get('DB_PASSORD'),
            port: this.configService.get('DB_PORT'),
            database: this.configService.get('DB_NAME'),
            entities: [User, Follower, Post, PostLike, PostComment, PostReport],
            synchronize: true,
        }
    }
} 