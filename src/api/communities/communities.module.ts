import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { CommunitiesEntity } from '../../entities/communities.entity';


@Module({
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
  imports: [TypeOrmModule.forFeature([CommunitiesEntity])],
})

export class CommunitiesModule { }
