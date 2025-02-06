import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { AuthModule } from './api/auth/auth.module';

import envVars from './config/env';
import { Users } from './api/auth/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: envVars.DB_HOST,
      port: envVars.DB_PORT,
      username: envVars.DB_USERNAME,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_DATABASE,
      entities: [Users]
    }),
    AuthModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
