import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CostsEntity } from '../../entities/costs.entity';
import { ExtrasByServiceEntity } from '../../entities/extras_by_service.entity';
import { ServicesEntity } from '../../entities/services.entity';
import { PrinterModule } from '../../printer/printer.module';

@Module({
  controllers: [ReportsController],
  providers: [ReportsService],
  imports: [PrinterModule, TypeOrmModule.forFeature([CostsEntity, ServicesEntity, ExtrasByServiceEntity])],
})
export class ReportsModule { }
