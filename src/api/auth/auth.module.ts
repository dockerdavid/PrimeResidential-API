import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { JwtStrategy } from './strategies/jwt.strategy';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UsersEntity } from 'src/entities/users.entity';

import envVars from 'src/config/env';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: envVars.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    TypeOrmModule.forFeature([UsersEntity])
  ],
  controllers: [AuthController],
  providers: [JwtStrategy, AuthService],
  exports: [JwtStrategy, PassportModule, JwtModule],
})

export class AuthModule { }
