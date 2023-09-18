import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { User } from './entities';

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
  providers: [],
})
export class AppModule {}
