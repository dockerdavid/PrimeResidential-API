import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { StatusesController } from './statuses.controller';
import { StatusesService } from './statuses.service';

import { StatusesEntity } from 'src/entities/statuses.entity';

@Module({
  controllers: [StatusesController],
  providers: [StatusesService],
  imports: [TypeOrmModule.forFeature([StatusesEntity])]
})

export class StatusesModule { }
