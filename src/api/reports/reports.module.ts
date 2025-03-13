import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { PrinterModule } from 'src/printer/printer.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostsEntity } from '../../entities/costs.entity';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [PrinterModule, TypeOrmModule.forFeature([CostsEntity])],
})
export class ReportsModule { }
