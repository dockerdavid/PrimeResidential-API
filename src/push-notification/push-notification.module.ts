import { Module } from '@nestjs/common';
import { TwilioModule } from 'nestjs-twilio';
import { PushNotificationsService } from './push-notification.service';

@Module({
  imports: [TwilioModule],
  providers: [PushNotificationsService],
  exports: [PushNotificationsService],
})

export class NotificationsModule {}
