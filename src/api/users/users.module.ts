import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { RolesEntity } from 'src/entities/roles.entity';
import { UsersEntity } from 'src/entities/users.entity';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [TypeOrmModule.forFeature([RolesEntity, UsersEntity])]
})
export class UsersModule { }
