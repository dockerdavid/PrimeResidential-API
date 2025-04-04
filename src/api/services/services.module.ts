import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { ServicesEntity } from '../../entities/services.entity';
import { ExtrasByServiceEntity } from '../../entities/extras_by_service.entity';
import { UsersEntity } from '../../entities/users.entity';
import { PushNotificationsService } from '../../push-notification/push-notification.service';

@Module({
  controllers: [ServicesController],
  providers: [ServicesService, PushNotificationsService],
  imports: [TypeOrmModule.forFeature([ServicesEntity, ExtrasByServiceEntity, UsersEntity])],
})
export class ServicesModule { }
