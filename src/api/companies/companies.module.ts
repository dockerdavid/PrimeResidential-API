import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';

import { CompaniesEntity } from 'src/entities/companies.entity';

@Module({
  controllers: [CompaniesController],
  providers: [CompaniesService],
  imports: [TypeOrmModule.forFeature([CompaniesEntity])],
})

export class CompaniesModule { }
