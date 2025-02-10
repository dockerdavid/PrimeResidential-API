import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

import { ExtrasByServiceEntity } from 'src/entities/extras_by_service.entity';
import { ServicesEntity } from 'src/entities/services.entity';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [TypeOrmModule.forFeature([ServicesEntity, ExtrasByServiceEntity])],
})
export class ServicesModule { }
