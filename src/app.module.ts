import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { User } from './entities';
import { APP_GUARD } from '@nestjs/core';
import { AtJwtGuard } from './guards';

@Module({
  imports: [TypeOrmModule.forRoot({
    type: 'mysql',
    host: 'localhost',
    username: 'root',
    password: '',
    port: 3306,
    database: 'nest_authentication',
    entities: [User],
    synchronize: true
  }), AuthModule],
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: AtJwtGuard
  }],
})
export class AppModule {}
