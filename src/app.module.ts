import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ServicesModule } from './api/services/services.module';
import { AuthModule } from './api/auth/auth.module';
import { UsersModule } from './api/users/users.module';

import envVars from './config/env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "mysql",
      host: envVars.DB_HOST,
      port: envVars.DB_PORT,
      username: envVars.DB_USERNAME,
      password: envVars.DB_PASSWORD,
      database: envVars.DB_DATABASE,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
    }),
    AuthModule,
    ServicesModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule { }
