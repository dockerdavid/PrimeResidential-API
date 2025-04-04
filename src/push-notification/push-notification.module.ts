import { Module } from '@nestjs/common';
import { PushNotificationsService } from './push-notification.service';

@Module({
  imports: [],
  providers: [PushNotificationsService],
  exports: [PushNotificationsService],
})

export class NotificationsModule { }
