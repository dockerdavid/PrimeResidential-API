import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

import { ServicesEntity } from 'src/entities/services.entity';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService],
  imports: [TypeOrmModule.forFeature([ServicesEntity])],
})
export class ServicesModule { }
