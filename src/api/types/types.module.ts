import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { TypesController } from './types.controller';
import { TypesService } from './types.service';

import { TypesEntity } from 'src/entities/types.entity';

@Module({
  controllers: [TypesController],
  providers: [TypesService],
  imports: [TypeOrmModule.forFeature([TypesEntity])]
})

export class TypesModule { }
