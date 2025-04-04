import { Module } from '@nestjs/common';
import { PushNotificationsService } from './push-notification.service';
import { TwilioModule } from 'nestjs-twilio';
import envVars from '../config/env';

@Module({
  imports: [TwilioModule.forRoot({
    accountSid: envVars.TWILIO_SID,
    authToken: envVars.TWILIO_TOKEN,
  }),],
  providers: [PushNotificationsService],
  exports: [PushNotificationsService],
})

export class NotificationsModule { }
