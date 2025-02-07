import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ExtrasController } from './extras.controller';
import { ExtrasService } from './extras.service';

import { ExtrasEntity } from 'src/entities/extras.entity';

@Module({
  controllers: [ExtrasController],
  providers: [ExtrasService],
  imports: [TypeOrmModule.forFeature([ExtrasEntity])]
})
export class ExtrasModule { }
