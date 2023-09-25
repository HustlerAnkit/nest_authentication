import { Module } from '@nestjs/common';
import { APP_GUARD, APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
// import { ConfigService } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
// import { User } from './config/entities';
import { AtJwtGuard } from './config/guards';
import { TypeOrmConfigService } from './config/services';
import { AllExceptionFilter, HttpExceptionFilter } from './config/filters';
// import { UserInterceptor } from './interceptors';

@Module({
  imports: [
    // using config values
    // TypeOrmModule.forRootAsync({
    //   // imports: [ConfigModule], // since its globally imported below....
    //   useFactory: (configService: ConfigService) => ({
    //       type: 'mysql',
    //       host: configService.get('DB_HOST'),
    //       username: configService.get('DB_USERNAME'),
    //       password: configService.get('DB_PASSORD'),
    //       port: configService.get('DB_PORT'),
    //       database: configService.get('DB_NAME'),
    //       entities: [User],
    //       synchronize: true,
    //   }),
    //   inject: [ ConfigService ]
    // }),
    // using direct values
    // TypeOrmModule.forRoot({
    //   type: 'mysql',
    //   host: 'localhost',
    //   username: 'root',
    //   password: '',
    //   port: 3306,
    //   database: 'nest_authentication',
    //   entities: [User],
    //   synchronize: true,
    // }),

    // using custom config file...
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AtJwtGuard,
    },    
    // {
    //   provide: APP_FILTER,
    //   useClass: HttpExceptionFilter
    // },
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter
    },
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: UserInterceptor
    // }
  ],
})
export class AppModule {}
