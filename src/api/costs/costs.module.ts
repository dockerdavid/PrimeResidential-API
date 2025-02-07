import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CostsController } from './costs.controller';
import { CostsService } from './costs.service';

import { CostsEntity } from 'src/entities/costs.entity';

@Module({
  controllers: [CostsController],
  providers: [CostsService],
  imports: [TypeOrmModule.forFeature([CostsEntity])],
})

export class CostsModule { }
